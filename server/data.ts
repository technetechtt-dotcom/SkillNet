import {
  ChatSummaryDto,
  JobDto,
  MessageDto,
  NotificationDto,
  UserDto,
  VideoDto,
  WalletDataDto
} from "../src/shared/dto";

export const users: UserDto[] = [
  {
    id: "u1",
    name: "Kwame Mensah",
    phone: "0801234567",
    location: "Accra, Ghana",
    avatar: "https://i.pravatar.cc/150?u=kwame",
    skills: [
      { id: "s1", name: "Mechanic", icon: "🔧", level: "expert" },
      { id: "s2", name: "Driver", icon: "🚗", level: "intermediate" }
    ],
    trustScore: 95,
    completedJobs: 42,
    rating: 4.8,
    bio: "Professional mechanic with 8 years of experience."
  }
];

export const videos: (VideoDto & { feed: "foryou" | "following" | "trending" })[] = [
  {
    id: "v1",
    userId: "u1",
    user: users[0],
    title: "Fixing a complex engine issue",
    skillCategory: "Mechanic",
    description: "How I diagnose and repair engine knocking sounds.",
    thumbnail:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    likes: 1240,
    comments: 85,
    shares: 32,
    duration: "0:45",
    feed: "foryou"
  },
  {
    id: "v2",
    userId: "u1",
    user: users[0],
    title: "Solar panel installation guide",
    skillCategory: "Electrician",
    description: "Full walkthrough of a residential solar setup.",
    thumbnail:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    likes: 432,
    comments: 28,
    shares: 19,
    duration: "2:15",
    feed: "trending"
  }
];

const employerA: UserDto = {
  id: "e1",
  name: "TechHub Ltd",
  phone: "",
  location: "Lagos",
  skills: [],
  trustScore: 98,
  completedJobs: 15,
  rating: 4.8,
  avatar: "https://i.pravatar.cc/150?u=techhub"
};

const employerB: UserDto = {
  id: "e2",
  name: "David Omondi",
  phone: "",
  location: "Nairobi",
  skills: [],
  trustScore: 90,
  completedJobs: 11,
  rating: 4.8
};

export const jobs: JobDto[] = [
  {
    id: "j1",
    title: "Need urgent plumbing repair for office building",
    description: "Water pipe burst in the main lobby. Need someone immediately.",
    location: "Victoria Island, Lagos",
    payment: "₦45,000",
    paymentType: "fixed",
    requiredSkills: ["Plumber", "Pipe Fitting"],
    employer: employerA,
    postedTime: "10 mins ago",
    applicants: 2,
    isUrgent: true
  },
  {
    id: "j2",
    title: "Full house wiring for 3-bedroom apartment",
    description: "Complete electrical installation for a newly built apartment.",
    location: "Kilimani, Nairobi",
    payment: "KSh 35,000",
    paymentType: "fixed",
    requiredSkills: ["Electrician", "Wiring"],
    employer: employerB,
    postedTime: "2 hours ago",
    applicants: 5
  }
];

export const chats: ChatSummaryDto[] = [
  {
    id: "c1",
    user: {
      name: "TechHub Ltd",
      avatar: "https://i.pravatar.cc/150?u=techhub",
      isOnline: true
    },
    lastMessage: "Can you come over tomorrow morning?",
    time: "10:42 AM",
    unread: 2
  }
];

export const chatMessages: Record<string, MessageDto[]> = {
  c1: [
    {
      id: "m1",
      senderId: "other",
      text: "Hello! I saw your profile and need a plumber.",
      timestamp: "10:30 AM",
      isRead: true
    },
    {
      id: "m2",
      senderId: "me",
      text: "Hi there! Yes, I am available. What seems to be the problem?",
      timestamp: "10:32 AM",
      isRead: true
    }
  ]
};

export const notifications: NotificationDto[] = [
  {
    id: "n1",
    type: "job",
    title: "New job near you",
    description: "Plumbing repair needed in Victoria Island, Lagos — ₦45,000",
    time: "10 mins ago",
    isRead: false
  }
];

export const wallet: WalletDataDto = {
  balance: 125000,
  weeklyEarned: 45000,
  jobsCompleted: 3,
  transactions: [
    {
      id: "t1",
      type: "received",
      title: "Payment from TechHub Ltd",
      amount: 45000,
      date: "Today, 2:30 PM",
      status: "completed",
      avatar: "https://i.pravatar.cc/150?u=techhub"
    }
  ]
};
