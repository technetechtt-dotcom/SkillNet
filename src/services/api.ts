import { request } from "../lib/http";
import {
  AddSkillRequestSchema,
  ChatPageSchema,
  JobPageSchema,
  MessagePageSchema,
  NotificationPageSchema,
  ReviewRequestSchema,
  SessionTokensDto,
  SessionTokensSchema,
  SkillSchema,
  UserSchema,
  VideoPageSchema,
  VideoSchema,
  WalletDataSchema,
  WalletTransactionPageSchema
} from "../shared/dto";

const parse = <T>(schema: { parse: (value: unknown) => T }, value: unknown): T =>
  schema.parse(value);

type PageParams = {
  page: number;
  pageSize: number;
};

export const api = {
  health: () => request<{ ok: boolean }>("/health"),
  signIn: (phone: string, password: string) =>
    request<SessionTokensDto>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ phone, password })
    }).then((data) => parse(SessionTokensSchema, data)),
  register: (payload: { name: string; phone: string; location: string }) =>
    request<SessionTokensDto>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }).then((data) => parse(SessionTokensSchema, data)),
  refreshSession: (refreshToken: string) =>
    request<SessionTokensDto>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    }).then((data) => parse(SessionTokensSchema, data)),
  logout: (refreshToken: string) =>
    request<{ ok: boolean }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    }),
  feedVideos: (tab: string | undefined, pagination: PageParams) =>
    request(
      `/feed/videos?tab=${encodeURIComponent(tab || "")}&page=${pagination.page}&pageSize=${pagination.pageSize}`
    ).then((data) => parse(VideoPageSchema, data)),
  postVideo: (
    payload: { title: string; category: string; description: string },
    token: string
  ) =>
    request(
      "/videos",
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      token
    ).then((data) => parse(VideoSchema, data)),
  jobs: (q: string, filter: string, pagination: PageParams) =>
    request(
      `/jobs?q=${encodeURIComponent(q)}&filter=${encodeURIComponent(filter)}&page=${pagination.page}&pageSize=${pagination.pageSize}`
    ).then((data) => parse(JobPageSchema, data)),
  job: (jobId: string) => request(`/jobs/${jobId}`).then((data) => parse(JobPageSchema.shape.items.element, data)),
  chats: (pagination: PageParams) =>
    request(`/chats?page=${pagination.page}&pageSize=${pagination.pageSize}`).then((data) =>
      parse(ChatPageSchema, data)
    ),
  chatMessages: (chatId: string, pagination: PageParams) =>
    request(
      `/chats/${chatId}/messages?page=${pagination.page}&pageSize=${pagination.pageSize}`
    ).then((data) => parse(MessagePageSchema, data)),
  sendMessage: (chatId: string, text: string) =>
    request(`/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ text })
    }).then((data) => parse(MessagePageSchema.shape.items.element, data)),
  wallet: (pagination: PageParams) =>
    request(`/wallet?page=${pagination.page}&pageSize=${pagination.pageSize}`).then((data) =>
      parse(WalletDataSchema, data)
    ),
  walletTransactions: (pagination: PageParams) =>
    request(
      `/wallet/transactions?page=${pagination.page}&pageSize=${pagination.pageSize}`
    ).then((data) => parse(WalletTransactionPageSchema, data)),
  withdraw: (amount: number, method: "bank" | "mobile") =>
    request<{ ok: boolean }>("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount, method })
    }, undefined, { auth: true }),
  notifications: (pagination: PageParams) =>
    request(`/notifications?page=${pagination.page}&pageSize=${pagination.pageSize}`).then(
      (data) => parse(NotificationPageSchema, data)
    ),
  markNotificationsRead: () =>
    request<{ ok: boolean }>("/notifications/mark-all-read", { method: "POST" }),
  me: () =>
    request("/profile/me", {}, undefined, { auth: true }).then((data) =>
      parse(UserSchema, data)
    ),
  updateMe: (payload: unknown) =>
    request(
      "/profile/me",
      {
        method: "PUT",
        body: JSON.stringify(payload)
      },
      undefined,
      { auth: true }
    ).then((data) => parse(UserSchema, data)),
  mySkills: () =>
    request("/profile/me/skills", {}, undefined, { auth: true }).then((data) =>
      parse(SkillSchema.array(), data)
    ),
  addSkill: (payload: unknown) =>
    request(
      "/profile/me/skills",
      {
        method: "POST",
        body: JSON.stringify(AddSkillRequestSchema.parse(payload))
      },
      undefined,
      { auth: true }
    ).then((data) => parse(SkillSchema, data)),
  removeSkill: (skillId: string) =>
    request<{ ok: boolean }>(
      `/profile/me/skills/${skillId}`,
      { method: "DELETE" },
      undefined,
      { auth: true }
    ),
  postReview: (payload: { rating: number; reviewText: string; tags: string[] }) =>
    request<{ ok: boolean }>("/reviews", {
      method: "POST",
      body: JSON.stringify(ReviewRequestSchema.parse(payload))
    })
};
