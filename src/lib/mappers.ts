import { ApiJob, ApiUser } from './api';
import { Job, User } from '../types';

export function mapApiUser(user: ApiUser | null): User {
  if (!user) {
    return {
      id: '',
      name: 'Unknown',
      phone: '',
      location: '',
      skills: [],
      trustScore: 0,
      completedJobs: 0,
      rating: 0,
    };
  }

  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    location: user.location || '',
    avatar: user.avatar || undefined,
    bio: user.bio || undefined,
    skills: user.skills,
    trustScore: user.trustScore,
    completedJobs: user.completedJobs,
    rating: user.rating,
    isOnline: user.isOnline,
  };
}

export function mapApiJob(job: ApiJob): Job {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    payment: job.payment,
    paymentType: job.paymentType,
    requiredSkills: job.requiredSkills,
    employer: mapApiUser(job.employer),
    postedTime: job.postedTime,
    applicants: job.applicants,
    isUrgent: job.isUrgent,
  };
}
