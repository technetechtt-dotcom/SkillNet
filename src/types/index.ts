export interface User {
  id: string;
  name: string;
  phone: string;
  location: string;
  avatar?: string;
  skills: Skill[];
  trustScore: number;
  completedJobs: number;
  rating: number;
  bio?: string;
  isOnline?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface Video {
  id: string;
  userId: string;
  user: User;
  title: string;
  skillCategory: string;
  description: string;
  thumbnail: string;
  likes: number;
  comments: number;
  shares: number;
  duration: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  payment: string;
  paymentType: 'fixed' | 'hourly' | 'daily';
  requiredSkills: string[];
  employer: User;
  postedTime: string;
  applicants: number;
  isUrgent?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
}

export interface Review {
  id: string;
  reviewer: User;
  rating: number;
  text: string;
  date: string;
  jobTitle: string;
}

export interface Notification {
  id: string;
  type: 'job' | 'application' | 'message' | 'follower' | 'review';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  avatar?: string;
}