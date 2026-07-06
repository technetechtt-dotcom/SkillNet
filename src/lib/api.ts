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
  },

  jobs: {
    list: (params?: { search?: string; location?: string; skill?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return request<ApiJob[]>(`/jobs${qs ? `?${qs}` : ''}`);
    },
    get: (id: string) => request<ApiJob>(`/jobs/${id}`),
    saved: () => request<ApiJob[]>('/jobs/saved'),
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
      request<{ success: boolean }>(`/jobs/${id}/apply`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
    save: (id: string) =>
      request<{ success: boolean }>(`/jobs/${id}/save`, { method: 'POST' }),
    unsave: (id: string) =>
      request<{ success: boolean }>(`/jobs/${id}/save`, { method: 'DELETE' }),
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
    withdraw: (amount: number, bankName: string, accountNumber: string) =>
      request<{ balance: number; formattedBalance: string }>('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount, bankName, accountNumber }),
      }),
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
};

export { ApiError };
