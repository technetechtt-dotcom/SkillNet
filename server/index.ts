import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  AddSkillRequestSchema,
  ChatPageSchema,
  JobPageSchema,
  MessagePageSchema,
  NotificationPageSchema,
  PaginationQuerySchema,
  PostVideoRequestSchema,
  RefreshRequestSchema,
  RegisterRequestSchema,
  ReviewRequestSchema,
  SendMessageRequestSchema,
  SessionTokensSchema,
  SignInRequestSchema,
  VideoPageSchema,
  WalletDataSchema,
  WalletTransactionPageSchema,
  WithdrawRequestSchema
} from "../src/shared/dto";
import { chatMessages, chats, jobs, notifications, users, videos, wallet } from "./data";

const app = express();
const port = Number(process.env.PORT || 4000);
const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

type Session = {
  userId: string;
  expiresAt: number;
};

const accessSessions = new Map<string, Session>();
const refreshSessions = new Map<string, Session>();

const now = () => Date.now();

const createSession = (userId: string) => {
  const accessToken = `access_${randomUUID()}`;
  const refreshToken = `refresh_${randomUUID()}`;
  accessSessions.set(accessToken, {
    userId,
    expiresAt: now() + ACCESS_TOKEN_TTL_SECONDS * 1000
  });
  refreshSessions.set(refreshToken, {
    userId,
    expiresAt: now() + REFRESH_TOKEN_TTL_SECONDS * 1000
  });
  return { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_TTL_SECONDS };
};

const revokeSession = (refreshToken: string) => {
  const session = refreshSessions.get(refreshToken);
  if (!session) return;
  refreshSessions.delete(refreshToken);
  for (const [token, access] of accessSessions.entries()) {
    if (access.userId === session.userId) {
      accessSessions.delete(token);
    }
  }
};

const parseBody = <T>(
  schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } },
  req: Request,
  res: Response
) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request payload." });
    return null;
  }
  return parsed.data;
};

const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const sliced = items.slice(start, start + pageSize);
  return {
    items: sliced,
    page,
    pageSize,
    total: items.length,
    hasNextPage: start + pageSize < items.length
  };
};

const parsePagination = (req: Request) =>
  PaginationQuerySchema.parse({
    page: Number(req.query.page || 1),
    pageSize: Number(req.query.pageSize || 10)
  });

const requireUser = (req: Request) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  const session = accessSessions.get(token);
  if (!session || session.expiresAt < now()) {
    return null;
  }
  return users.find((user) => user.id === session.userId) || null;
};

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120
  })
);

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.post("/auth/signin", (req, res) => {
  const payload = parseBody(SignInRequestSchema, req, res);
  if (!payload) return;

  const user = users.find((item) => item.phone === payload.phone) || users[0];
  const session = createSession(user.id);
  res.json(SessionTokensSchema.parse({ ...session, user }));
});

app.post("/auth/register", (req, res) => {
  const payload = parseBody(RegisterRequestSchema, req, res);
  if (!payload) return;

  const created = {
    id: `u${Date.now()}`,
    name: payload.name,
    phone: payload.phone,
    location: payload.location,
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(payload.phone)}`,
    skills: [],
    trustScore: 80,
    completedJobs: 0,
    rating: 0
  };
  users.push(created);
  const session = createSession(created.id);
  res.status(201).json(SessionTokensSchema.parse({ ...session, user: created }));
});

app.post("/auth/refresh", (req, res) => {
  const payload = parseBody(RefreshRequestSchema, req, res);
  if (!payload) return;

  const refresh = refreshSessions.get(payload.refreshToken);
  if (!refresh || refresh.expiresAt < now()) {
    res.status(401).json({ message: "Refresh token expired." });
    return;
  }

  refreshSessions.delete(payload.refreshToken);
  const user = users.find((entry) => entry.id === refresh.userId);
  if (!user) {
    res.status(401).json({ message: "Session user missing." });
    return;
  }
  const session = createSession(user.id);
  res.json(SessionTokensSchema.parse({ ...session, user }));
});

app.post("/auth/logout", (req, res) => {
  const payload = parseBody(RefreshRequestSchema, req, res);
  if (!payload) return;
  revokeSession(payload.refreshToken);
  res.json({ ok: true });
});

app.get("/feed/videos", (req, res) => {
  const tab = String(req.query.tab || "");
  const { page, pageSize } = parsePagination(req);
  const selected = tab ? videos.filter((video) => video.feed === tab) : videos;
  const response = paginate(selected, page, pageSize);
  res.json(VideoPageSchema.parse(response));
});

app.post("/videos", (req, res) => {
  const user = requireUser(req);
  if (!user) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }
  const payload = parseBody(PostVideoRequestSchema, req, res);
  if (!payload) return;

  const created = {
    id: `v${Date.now()}`,
    userId: user.id,
    user,
    title: payload.title,
    skillCategory: payload.category,
    description: payload.description,
    thumbnail: payload.thumbnail || videos[0].thumbnail,
    likes: 0,
    comments: 0,
    shares: 0,
    duration: payload.duration || "0:30",
    feed: "foryou" as const
  };
  videos.unshift(created);
  res.status(201).json(created);
});

app.get("/jobs", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const filter = String(req.query.filter || "");
  const { page, pageSize } = parsePagination(req);

  const filtered = jobs.filter((job) => {
    const queryMatch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);
    const filterMatch =
      !filter ||
      filter === "All" ||
      (filter === "Urgent" && job.isUrgent) ||
      job.requiredSkills.some((skill) =>
        skill.toLowerCase().includes(filter.toLowerCase())
      );
    return queryMatch && filterMatch;
  });

  res.json(JobPageSchema.parse(paginate(filtered, page, pageSize)));
});

app.get("/jobs/:jobId", (req, res) => {
  const job = jobs.find((item) => item.id === req.params.jobId);
  if (!job) {
    res.status(404).json({ message: "Job not found." });
    return;
  }
  res.json(job);
});

app.get("/chats", (req, res) => {
  const { page, pageSize } = parsePagination(req);
  res.json(ChatPageSchema.parse(paginate(chats, page, pageSize)));
});

app.get("/chats/:chatId/messages", (req, res) => {
  const { page, pageSize } = parsePagination(req);
  const list = chatMessages[req.params.chatId] || [];
  res.json(MessagePageSchema.parse(paginate(list, page, pageSize)));
});

app.post("/chats/:chatId/messages", (req, res) => {
  const payload = parseBody(SendMessageRequestSchema, req, res);
  if (!payload) return;

  const list = chatMessages[req.params.chatId] || [];
  const created = {
    id: `m${Date.now()}`,
    senderId: "me",
    text: payload.text,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),
    isRead: false
  };
  list.push(created);
  chatMessages[req.params.chatId] = list;
  const chat = chats.find((item) => item.id === req.params.chatId);
  if (chat) {
    chat.lastMessage = created.text;
    chat.time = created.timestamp;
  }
  res.status(201).json(created);
});

app.get("/wallet", (req, res) => {
  const { page, pageSize } = parsePagination(req);
  const pagedTransactions = paginate(wallet.transactions, page, pageSize);
  res.json(
    WalletDataSchema.parse({
      ...wallet,
      transactions: pagedTransactions.items
    })
  );
});

app.get("/wallet/transactions", (req, res) => {
  const { page, pageSize } = parsePagination(req);
  res.json(
    WalletTransactionPageSchema.parse(paginate(wallet.transactions, page, pageSize))
  );
});

app.post("/wallet/withdraw", (req, res) => {
  const payload = parseBody(WithdrawRequestSchema, req, res);
  if (!payload) return;

  if (payload.amount > wallet.balance) {
    res.status(400).json({ message: "Invalid amount." });
    return;
  }
  wallet.balance -= payload.amount;
  wallet.transactions.unshift({
    id: `t${Date.now()}`,
    type: "withdrawal",
    title: "Withdrawal request",
    amount: -payload.amount,
    date: "Just now",
    status: "pending"
  });
  res.json({ ok: true });
});

app.get("/notifications", (req, res) => {
  const { page, pageSize } = parsePagination(req);
  res.json(NotificationPageSchema.parse(paginate(notifications, page, pageSize)));
});

app.post("/notifications/mark-all-read", (_, res) => {
  notifications.forEach((item) => {
    item.isRead = true;
  });
  res.json({ ok: true });
});

app.get("/profile/me", (req, res) => {
  const user = requireUser(req);
  if (!user) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }
  res.json(user);
});

app.put("/profile/me", (req, res) => {
  const user = requireUser(req);
  if (!user) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }
  Object.assign(user, req.body);
  res.json(user);
});

app.get("/profile/me/skills", (req, res) => {
  const user = requireUser(req);
  if (!user) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }
  res.json(user.skills);
});

app.post("/profile/me/skills", (req, res) => {
  const user = requireUser(req);
  if (!user) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }
  const payload = parseBody(AddSkillRequestSchema, req, res);
  if (!payload) return;

  const created = { id: `s${Date.now()}`, ...payload };
  user.skills.push(created);
  res.status(201).json(created);
});

app.delete("/profile/me/skills/:skillId", (req, res) => {
  const user = requireUser(req);
  if (!user) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }
  user.skills = user.skills.filter((item) => item.id !== req.params.skillId);
  res.json({ ok: true });
});

app.post("/reviews", (req, res) => {
  const payload = parseBody(ReviewRequestSchema, req, res);
  if (!payload) return;
  void payload;
  res.json({ ok: true });
});

const thisFilePath = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === thisFilePath;
if (isMainModule) {
  app.listen(port, () => {
    console.log(`SkillNet API listening on port ${port}`);
  });
}

export default app;
