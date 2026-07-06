import { z } from "zod";

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  icon: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "expert"])
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  phone: z.string(),
  location: z.string(),
  avatar: z.string().optional(),
  skills: z.array(SkillSchema),
  trustScore: z.number(),
  completedJobs: z.number(),
  rating: z.number(),
  bio: z.string().optional(),
  isOnline: z.boolean().optional()
});

export const VideoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  user: UserSchema,
  title: z.string().min(1),
  skillCategory: z.string().min(1),
  description: z.string().min(1),
  thumbnail: z.string().url(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
  duration: z.string(),
  feed: z.enum(["foryou", "following", "trending"]).optional()
});

export const JobSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  payment: z.string().min(1),
  paymentType: z.enum(["fixed", "hourly", "daily"]),
  requiredSkills: z.array(z.string()),
  employer: UserSchema,
  postedTime: z.string(),
  applicants: z.number(),
  isUrgent: z.boolean().optional()
});

export const MessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  imageUrl: z.string().url().optional(),
  timestamp: z.string(),
  isRead: z.boolean()
});

export const ChatSummarySchema = z.object({
  id: z.string(),
  user: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    isOnline: z.boolean().optional()
  }),
  lastMessage: z.string(),
  time: z.string(),
  unread: z.number()
});

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(["job", "application", "message", "follower", "review"]),
  title: z.string(),
  description: z.string(),
  time: z.string(),
  isRead: z.boolean(),
  avatar: z.string().optional()
});

export const WalletTransactionSchema = z.object({
  id: z.string(),
  type: z.enum(["received", "sent", "withdrawal"]),
  title: z.string(),
  amount: z.number(),
  date: z.string(),
  status: z.enum(["completed", "pending"]),
  avatar: z.string().optional()
});

export const WalletDataSchema = z.object({
  balance: z.number(),
  weeklyEarned: z.number(),
  jobsCompleted: z.number(),
  transactions: z.array(WalletTransactionSchema)
});

export const SessionTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  user: UserSchema
});

export const SignInRequestSchema = z.object({
  phone: z.string().min(3),
  password: z.string().min(4)
});

export const RegisterRequestSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(3),
  location: z.string().min(2)
});

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(10)
});

export const PostVideoRequestSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  description: z.string().min(3).max(200),
  thumbnail: z.string().url().optional(),
  duration: z.string().optional()
});

export const SendMessageRequestSchema = z.object({
  text: z.string().min(1).max(2000)
});

export const WithdrawRequestSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(["bank", "mobile"])
});

export const AddSkillRequestSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "expert"])
});

export const ReviewRequestSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().max(1000),
  tags: z.array(z.string())
});

export const PaginationQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(10)
});

export const createPaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    hasNextPage: z.boolean()
  });

export const VideoPageSchema = createPaginatedSchema(VideoSchema);
export const JobPageSchema = createPaginatedSchema(JobSchema);
export const ChatPageSchema = createPaginatedSchema(ChatSummarySchema);
export const NotificationPageSchema = createPaginatedSchema(NotificationSchema);
export const MessagePageSchema = createPaginatedSchema(MessageSchema);
export const WalletTransactionPageSchema = createPaginatedSchema(WalletTransactionSchema);

export type SkillDto = z.infer<typeof SkillSchema>;
export type UserDto = z.infer<typeof UserSchema>;
export type VideoDto = z.infer<typeof VideoSchema>;
export type JobDto = z.infer<typeof JobSchema>;
export type MessageDto = z.infer<typeof MessageSchema>;
export type ChatSummaryDto = z.infer<typeof ChatSummarySchema>;
export type NotificationDto = z.infer<typeof NotificationSchema>;
export type WalletDataDto = z.infer<typeof WalletDataSchema>;
export type WalletTransactionDto = z.infer<typeof WalletTransactionSchema>;
export type SessionTokensDto = z.infer<typeof SessionTokensSchema>;
export type PaginatedDto<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
};
