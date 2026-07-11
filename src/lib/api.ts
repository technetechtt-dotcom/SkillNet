const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getToken(): string | null {
  return localStorage.getItem('skillnet_token');
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('skillnet_token', token);
  } else {
    localStorage.removeItem('skillnet_token');
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || 'Request failed', res.status);
  }

  return data as T;
}

export interface ApiUser {
  id: string;
  name: string;
  phone: string;
  location: string | null;
  avatar: string | null;
  bio: string | null;
  trustScore: number;
  completedJobs: number;
  rating: number;
  isOnline: boolean;
  role?: string;
  skills: {
    id: string;
    name: string;
    icon: string;
    level: 'beginner' | 'intermediate' | 'expert';
  }[];
}

export interface ApiJob {
  id: string;
  title: string;
  description: string;
  location: string;
  payment: string;
  paymentAmount: number;
  paymentCurrency: string;
  paymentType: 'fixed' | 'hourly' | 'daily';
  requiredSkills: string[];
  employer: ApiUser | null;
  postedTime: string;
  applicants: number;
  isUrgent?: boolean;
  status?: 'open' | 'filled' | 'closed';
}

export interface ApiJobApplication {
  id: string;
  jobId: string;
  jobTitle: string | null;
  applicantId: string;
  applicant: ApiUser | null;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  postedTime: string;
}

export interface ApiReview {
  id: string;
  rating: number;
  comment: string | null;
  jobId: string | null;
  reviewer: ApiUser | null;
  createdAt: string;
  time: string;
}

export interface ApiVideo {
  id: string;
  userId: string;
  user: ApiUser | null;
  title: string;
  skillCategory: string | null;
  description: string | null;
  thumbnail: string | null;
  videoUrl: string | null;
  likes: number;
  comments: number;
  shares: number;
  duration: string | null;
}

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  description: string | null;
  time: string;
  isRead: boolean;
  metadata?: Record<string, string>;
}

export interface ApiWallet {
  balance: number;
  currency: string;
  formattedBalance: string;
  transactions: {
    id: string;
    type: string;
    amount: number;
    formattedAmount: string;
    description: string | null;
    status: string;
    time: string;
    createdAt: string;
  }[];
}

export interface ApiChat {
  id: string;
  user: ApiUser | null;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
}

export interface ApiMessage {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string | null;
  timestamp: string;
  isRead: boolean;
}

export interface ApiInvoice {
  id: string;
  type: 'invoice' | 'quote';
  number: string;
  clientName: string;
  amount: number;
  formattedAmount: string;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  date: string;
  dueDate: string | null;
  notes: string | null;
  lineItems: { description: string; quantity: number; rate: number }[];
  createdAt: string;
}

export interface ApiStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  skill: string;
  image: string;
  text: string;
  timestamp: string;
}

export interface ApiStoryGroup {
  userId: string;
  userName: string;
  userAvatar: string | null;
  stories: ApiStory[];
}

export interface ApiStoryRing {
  userId: string;
  userName: string;
  userAvatar: string | null;
  hasUnread: boolean;
}

export interface ApiChallenge {
  id: string;
  name: string;
  emoji: string;
  description?: string | null;
  category: string;
  participants: number;
  daysLeft?: number;
  startsIn?: number;
  prize?: string | null;
  status: string;
  featured?: boolean;
  joined?: boolean;
  winners?: { name: string; avatar: string | null }[];
}

export interface ApiExploreData {
  categories: { name: string; icon: string }[];
  featuredWorkers: {
    id: string;
    name: string;
    skill: string;
    rating: number;
    avatar: string | null;
  }[];
  trendingVideos: { id: string; title: string; views: string; image: string }[];
  activeChallenge: {
    hashtag: string;
    name: string;
    participants: number;
    daysLeft: number;
  } | null;
}

export interface ApiNearbyWorker {
  id: string;
  name: string;
  skill: string;
  distance: string;
  distanceKm: number;
  rating: number;
  status: string;
  avatar: string | null;
  latitude: number;
  longitude: number;
  phone: string;
}

export interface ApiTransactionDetail {
  id: string;
  type: 'withdrawal' | 'received' | 'sent';
  title: string;
  amount: number;
  date: string;
  status: string;
  ref: string;
  bankDetails?: string;
  note?: string;
  jobRef?: string;
  avatar?: string;
}

export interface ApiProgram {
  id: string;
  slug: string;
  title: string;
  type: string;
  provider: string | null;
  description: string | null;
  location: string | null;
  duration: string | null;
  stipend: string | null;
  fundingAmount: string | null;
  nqf: string | null;
  closingDate: string | null;
  spots: number | null;
  status: string;
  featured: boolean;
  createdAt: string;
}

export interface AdminStats {
  counts: {
    users: number;
    jobs: number;
    videos: number;
    stories: number;
    challenges: number;
    programs: number;
    transactions: number;
    walletBalance: number;
  };
  recentUsers: {
    id: string;
    name: string;
    phone: string;
    role: string;
    createdAt: string;
  }[];
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  location: string | null;
  role: string;
  accountStatus: string;
  blockedUntil: string | null;
  blockReason: string | null;
  trustScore: number;
  rating: number;
  isOnline: boolean;
  createdAt: string;
  followerCount?: number;
  followingCount?: number;
}

export interface AdminVideo {
  id: string;
  title: string;
  description: string | null;
  skillCategory: string | null;
  thumbnail: string | null;
  videoUrl: string | null;
  likes: number;
  comments: number;
  shares: number;
  duration: string | null;
  status: string;
  moderationReason: string | null;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
  createdAt: string;
}

export interface AdminStory {
  id: string;
  text: string | null;
  skillTag: string | null;
  mediaType: string;
  mediaUrl: string;
  status: string;
  moderationReason: string | null;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface AdminJob {
  id: string;
  title: string;
  location: string;
  paymentAmount: number;
  paymentCurrency: string;
  isUrgent: boolean;
  employerId: string;
  employerName: string | null;
  createdAt: string;
}

export interface AdminChallenge {
  id: string;
  name: string;
  hashtag: string;
  emoji: string;
  description: string | null;
  category: string;
  prize: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
  featured: boolean;
}

export interface AdminTransaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  status: string;
  reference: string | null;
  createdAt: string;
  userName: string | null;
}

export interface AdminEngagement {
  likes: {
    userId: string;
    userName: string | null;
    userAvatar: string | null;
    reaction: string;
    createdAt: string;
  }[];
  comments: {
    id: string;
    userId: string;
    userName: string | null;
    userAvatar: string | null;
    text: string;
    status: string;
    createdAt: string;
  }[];
  shares: {
    id: string;
    userId: string;
    userName: string | null;
    userAvatar: string | null;
    createdAt: string;
  }[];
}

export interface AdminChatSummary {
  chatId: string;
  participants: {
    userId: string;
    name: string | null;
    phone: string | null;
    avatar: string | null;
  }[];
  lastMessage: {
    text: string;
    senderId: string;
    senderName: string | null;
    createdAt: string;
    timeAgo: string;
  } | null;
  messageCount: number;
}

export interface AdminChatDetail {
  chatId: string;
  participants: {
    userId: string;
    name: string | null;
    phone: string | null;
    avatar: string | null;
  }[];
  messages: {
    id: string;
    senderId: string;
    senderName: string | null;
    senderAvatar: string | null;
    text: string;
    imageUrl: string | null;
    isRead: boolean;
    createdAt: string;
    timeAgo: string;
  }[];
}

export interface ModerationLog {
  id: string;
  targetType: string;
  targetId: string;
  action: string;
  reason: string | null;
  createdAt: string;
  adminName: string | null;
}

export interface AdminFollowRelation {
  followerId: string;
  followerName: string;
  followerPhone: string;
  followerAvatar: string | null;
  followingId: string;
  followingName: string;
  followingPhone: string;
  followingAvatar: string | null;
  createdAt: string;
}

export interface AdminUserSocial {
  user: { id: string; name: string; phone: string };
  followerCount: number;
  followingCount: number;
  followers: {
    userId: string;
    name: string;
    phone: string;
    avatar: string | null;
    createdAt: string;
  }[];
  following: {
    userId: string;
    name: string;
    phone: string;
    avatar: string | null;
    createdAt: string;
  }[];
}

export const api = {
  auth: {
    login: (phone: string, password: string) =>
      request<{ token: string; user: ApiUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      }),
    register: (data: {
      phone: string;
      password: string;
      name: string;
      location?: string;
      skills?: { name: string; icon?: string; level?: string }[];
    }) =>
      request<{ token: string; user: ApiUser }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    sendOtp: (phone: string, purpose: 'login' | 'register' = 'login') =>
      request<{ success: boolean; message: string; expiresAt: string }>(
        '/auth/otp/send',
        {
          method: 'POST',
          body: JSON.stringify({ phone, purpose }),
        }
      ),
    loginWithOtp: (phone: string, code: string) =>
      request<{ token: string; user: ApiUser }>('/auth/otp/login', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
      }),
    registerWithOtp: (data: {
      phone: string;
      code: string;
      password: string;
      name: string;
      location?: string;
      skills?: { name: string; icon?: string; level?: string }[];
    }) =>
      request<{ token: string; user: ApiUser }>('/auth/otp/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  users: {
    me: () => request<ApiUser>('/users/me'),
    get: (id: string) => request<ApiUser>(`/users/${id}`),
    search: (q?: string) =>
      request<ApiUser[]>(`/users/search${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    update: (data: Partial<Pick<ApiUser, 'name' | 'location' | 'bio' | 'avatar'>>) =>
      request<ApiUser>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    updateSkills: (skills: { name: string; icon?: string; level?: string }[]) =>
      request<ApiUser>('/users/me/skills', {
        method: 'PUT',
        body: JSON.stringify({ skills }),
      }),
    follow: (id: string) =>
      request<{ success: boolean; following: boolean }>(`/users/${id}/follow`, {
        method: 'POST',
      }),
    unfollow: (id: string) =>
      request<{ success: boolean; following: boolean }>(`/users/${id}/follow`, {
        method: 'DELETE',
      }),
    followers: (id: string) =>
      request<
        { userId: string; name: string; avatar: string | null; phone: string }[]
      >(`/users/${id}/followers`),
    following: (id: string) =>
      request<
        { userId: string; name: string; avatar: string | null; phone: string }[]
      >(`/users/${id}/following`),
  },

  jobs: {
    list: (params?: { search?: string; location?: string; skill?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return request<ApiJob[]>(`/jobs${qs ? `?${qs}` : ''}`);
    },
    get: (id: string) => request<ApiJob>(`/jobs/${id}`),
    mine: () => request<ApiJob[]>('/jobs/mine'),
    saved: () => request<ApiJob[]>('/jobs/saved'),
    myApplications: () => request<ApiJobApplication[]>('/jobs/applications/mine'),
    applications: (jobId: string) =>
      request<ApiJobApplication[]>(`/jobs/${jobId}/applications`),
    updateApplication: (applicationId: string, status: 'accepted' | 'rejected') =>
      request<ApiJobApplication>(`/jobs/applications/${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    updateStatus: (id: string, status: 'open' | 'filled' | 'closed') =>
      request<ApiJob>(`/jobs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    create: (data: {
      title: string;
      description: string;
      location: string;
      paymentAmount: number;
      paymentCurrency?: string;
      paymentType: string;
      requiredSkills?: string[];
      isUrgent?: boolean;
    }) =>
      request<ApiJob>('/jobs', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    apply: (id: string, message?: string) =>
      request<ApiJobApplication>(`/jobs/${id}/apply`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
    save: (id: string) =>
      request<{ success: boolean }>(`/jobs/${id}/save`, { method: 'POST' }),
    unsave: (id: string) =>
      request<{ success: boolean }>(`/jobs/${id}/save`, { method: 'DELETE' }),
  },

  reviews: {
    create: (data: {
      revieweeId: string;
      jobId?: string;
      rating: number;
      comment?: string;
    }) =>
      request<{
        id: string;
        rating: number;
        revieweeRating: number;
        reviewCount: number;
      }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    forUser: (userId: string) =>
      request<{ average: number; count: number; reviews: ApiReview[] }>(
        `/reviews/user/${userId}`
      ),
  },

  videos: {
    list: () => request<ApiVideo[]>('/videos'),
    uploadConfig: () =>
      request<{ configured: boolean; cloudName: string; uploadPreset: string }>(
        '/videos/upload-config'
      ),
    upload: async (file: File) => {
      const token = getToken();
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/videos/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new ApiError(data.error || 'Upload failed', res.status);
      return data as { videoUrl: string | null; thumbnail: string; mediaType: string };
    },
    create: (data: {
      title: string;
      skillCategory?: string;
      description?: string;
      thumbnail?: string;
      videoUrl?: string;
      duration?: string;
    }) =>
      request<ApiVideo>('/videos', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    like: (id: string, reaction = 'like') =>
      request<{ success: boolean; reaction: string }>(`/videos/${id}/like`, {
        method: 'POST',
        body: JSON.stringify({ reaction }),
      }),
    comment: (id: string, text: string) =>
      request<{ id: string }>(`/videos/${id}/comment`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
    share: (id: string) =>
      request<{ success: boolean }>(`/videos/${id}/share`, { method: 'POST' }),
  },

  notifications: {
    list: () => request<ApiNotification[]>('/notifications'),
    markRead: (id: string) =>
      request<{ success: boolean }>(`/notifications/${id}/read`, {
        method: 'PATCH',
      }),
    markAllRead: () =>
      request<{ success: boolean }>('/notifications/read-all', {
        method: 'PATCH',
      }),
  },

  wallet: {
    get: () => request<ApiWallet>('/wallet'),
    stats: () =>
      request<{
        weeklyEarned: number;
        formattedWeeklyEarned: string;
        jobsCompleted: number;
      }>('/wallet/stats'),
    getTransaction: (id: string) =>
      request<ApiTransactionDetail>(`/wallet/transactions/${id}`),
    paystackInitialize: (amount: number) =>
      request<{
        reference: string;
        authorizationUrl: string | null;
        devMode: boolean;
        paystackConfigured: boolean;
      }>('/wallet/paystack/initialize', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
    paystackVerify: (reference: string) =>
      request<{
        success: boolean;
        balance: number;
        formattedBalance: string;
        alreadyProcessed?: boolean;
      }>(`/wallet/paystack/verify?reference=${encodeURIComponent(reference)}`),
    add: (amount: number, description?: string) =>
      request<{ balance: number; formattedBalance: string }>('/wallet/add', {
        method: 'POST',
        body: JSON.stringify({ amount, description }),
      }),
    send: (amount: number, recipientPhone: string, description?: string) =>
      request<{ balance: number; formattedBalance: string }>('/wallet/send', {
        method: 'POST',
        body: JSON.stringify({ amount, recipientPhone, description }),
      }),
    withdraw: (
      amount: number,
      bankName: string,
      accountNumber: string,
      bankCode: string,
      accountName?: string
    ) =>
      request<{
        balance: number;
        formattedBalance: string;
        status: string;
        reference: string;
        paystackConfigured: boolean;
        devMode: boolean;
      }>('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          bankName,
          accountNumber,
          bankCode,
          accountName,
        }),
      }),
    banks: () =>
      request<{
        banks: { name: string; code: string; slug: string }[];
        devMode: boolean;
      }>('/wallet/banks'),
  },

  chats: {
    list: () => request<ApiChat[]>('/chats'),
    messages: (chatId: string) =>
      request<ApiMessage[]>(`/chats/${chatId}/messages`),
    send: (chatId: string, text: string) =>
      request<ApiMessage>(`/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
    start: (userId: string) =>
      request<{ chatId: string }>('/chats/start', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),
  },

  invoices: {
    list: () => request<ApiInvoice[]>('/invoices'),
    get: (id: string) => request<ApiInvoice>(`/invoices/${id}`),
    create: (data: {
      clientName: string;
      type?: 'invoice' | 'quote';
      amount: number;
      dueDate?: string;
      notes?: string;
      lineItems?: { description: string; quantity: number; rate: number }[];
      status?: string;
    }) =>
      request<ApiInvoice>('/invoices', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: string) =>
      request<ApiInvoice>(`/invoices/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    downloadPdf: async (id: string) => {
      const token = getToken();
      const res = await fetch(`${API_BASE}/invoices/${id}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new ApiError('Failed to download PDF', res.status);
      return res.blob();
    },
  },

  stories: {
    list: () => request<ApiStoryGroup[]>('/stories'),
    feed: () => request<ApiStoryRing[]>('/stories/feed'),
    create: (data: {
      mediaUrl: string;
      text?: string;
      skillTag?: string;
      mediaType?: string;
    }) =>
      request<ApiStory>('/stories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  challenges: {
    list: () => request<ApiChallenge[]>('/challenges'),
    featured: () => request<ApiChallenge | null>('/challenges/featured'),
    join: (id: string) =>
      request<{ success: boolean }>(`/challenges/${id}/join`, { method: 'POST' }),
  },

  explore: {
    get: (params?: { category?: string; q?: string }) => {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params || {}).filter(([, v]) => v)
        ) as Record<string, string>
      ).toString();
      return request<ApiExploreData>(`/explore${qs ? `?${qs}` : ''}`);
    },
  },

  workers: {
    nearby: (params?: { lat?: number; lng?: number; skill?: string }) => {
      const qs = new URLSearchParams();
      if (params?.lat) qs.set('lat', String(params.lat));
      if (params?.lng) qs.set('lng', String(params.lng));
      if (params?.skill) qs.set('skill', params.skill);
      return request<ApiNearbyWorker[]>(`/workers/nearby?${qs.toString()}`);
    },
  },

  programs: {
    list: (params?: { type?: string; featured?: boolean }) => {
      const qs = new URLSearchParams();
      if (params?.type) qs.set('type', params.type);
      if (params?.featured) qs.set('featured', 'true');
      return request<ApiProgram[]>(`/programs${qs.toString() ? `?${qs}` : ''}`);
    },
    get: (slug: string) => request<ApiProgram>(`/programs/${slug}`),
  },

  admin: {
    stats: () => request<AdminStats>('/admin/stats'),
    users: {
      list: (params?: { q?: string; role?: string }) => {
        const qs = new URLSearchParams();
        if (params?.q) qs.set('q', params.q);
        if (params?.role) qs.set('role', params.role);
        return request<AdminUser[]>(`/admin/users${qs.toString() ? `?${qs}` : ''}`);
      },
      get: (id: string) => request<ApiUser>(`/admin/users/${id}`),
      create: (data: {
        phone: string;
        password: string;
        name: string;
        location?: string;
        role?: string;
      }) =>
        request<ApiUser>('/admin/users', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (
        id: string,
        data: Partial<{
          name: string;
          location: string;
          bio: string;
          role: string;
          trustScore: number;
          rating: number;
          availabilityStatus: string;
        }>
      ) =>
        request<ApiUser>(`/admin/users/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        request<{ success: boolean }>(`/admin/users/${id}`, { method: 'DELETE' }),
      content: (id: string) =>
        request<{ videos: AdminVideo[]; stories: AdminStory[] }>(
          `/admin/users/${id}/content`
        ),
      social: (id: string) =>
        request<AdminUserSocial>(`/admin/users/${id}/social`),
    },
    follows: {
      list: (q?: string) =>
        request<AdminFollowRelation[]>(
          `/admin/follows${q ? `?q=${encodeURIComponent(q)}` : ''}`
        ),
    },
    videos: {
      list: (params?: { userId?: string }) => {
        const qs = params?.userId
          ? `?userId=${encodeURIComponent(params.userId)}`
          : '';
        return request<AdminVideo[]>(`/admin/videos${qs}`);
      },
      get: (id: string) => request<AdminVideo>(`/admin/videos/${id}`),
      engagement: (id: string) =>
        request<AdminEngagement>(`/admin/videos/${id}/engagement`),
      moderate: (
        id: string,
        data: { status: 'active' | 'blocked' | 'removed'; reason?: string }
      ) =>
        request<AdminVideo>(`/admin/videos/${id}/moderate`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        request<{ success: boolean }>(`/admin/videos/${id}`, { method: 'DELETE' }),
    },
    stories: {
      list: (params?: { userId?: string }) => {
        const qs = params?.userId
          ? `?userId=${encodeURIComponent(params.userId)}`
          : '';
        return request<AdminStory[]>(`/admin/stories${qs}`);
      },
      get: (id: string) => request<AdminStory>(`/admin/stories/${id}`),
      moderate: (
        id: string,
        data: { status: 'active' | 'blocked' | 'removed'; reason?: string }
      ) =>
        request<AdminStory>(`/admin/stories/${id}/moderate`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        request<{ success: boolean }>(`/admin/stories/${id}`, { method: 'DELETE' }),
    },
    jobs: {
      list: () => request<AdminJob[]>('/admin/jobs'),
      delete: (id: string) =>
        request<{ success: boolean }>(`/admin/jobs/${id}`, { method: 'DELETE' }),
    },
    challenges: {
      list: () => request<AdminChallenge[]>('/admin/challenges'),
      create: (data: Partial<AdminChallenge> & {
        name: string;
        hashtag: string;
        category: string;
        startsAt: string;
        endsAt: string;
      }) =>
        request<AdminChallenge>('/admin/challenges', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: Partial<AdminChallenge>) =>
        request<AdminChallenge>(`/admin/challenges/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        request<{ success: boolean }>(`/admin/challenges/${id}`, {
          method: 'DELETE',
        }),
    },
    programs: {
      list: () => request<ApiProgram[]>('/admin/programs'),
      create: (data: Partial<ApiProgram> & { slug: string; title: string; type: string }) =>
        request<ApiProgram>('/admin/programs', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: Partial<ApiProgram>) =>
        request<ApiProgram>(`/admin/programs/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        request<{ success: boolean }>(`/admin/programs/${id}`, {
          method: 'DELETE',
        }),
    },
    transactions: {
      list: () => request<AdminTransaction[]>('/admin/transactions'),
    },
    moderation: {
      blockUser: (
        id: string,
        data: { reason?: string; duration?: string; blockedUntil?: string }
      ) =>
        request<ApiUser>(`/admin/users/${id}/block`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      unblockUser: (id: string) =>
        request<ApiUser>(`/admin/users/${id}/unblock`, { method: 'PATCH' }),
      moderateComment: (
        id: string,
        data: { status: 'active' | 'blocked' | 'removed'; reason?: string }
      ) =>
        request<{ id: string; status: string }>(`/admin/comments/${id}/moderate`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      logs: () => request<ModerationLog[]>('/admin/moderation/logs'),
    },
    messages: {
      list: () => request<AdminChatSummary[]>('/admin/messages'),
      get: (chatId: string) => request<AdminChatDetail>(`/admin/messages/${chatId}`),
    },
  },
};

export { ApiError };
