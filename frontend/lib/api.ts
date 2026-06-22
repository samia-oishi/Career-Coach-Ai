import axios from 'axios';
import type { ApiResponse, Blog, Career } from './types';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const fetchCareers = async (params?: Record<string, string>) => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/careers${query}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to load careers');
  return (await response.json()) as ApiResponse<{ items: Career[]; total: number; page: number; totalPages: number }>;
};

export const fetchFeaturedCareers = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/careers/featured`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to load featured careers');
  return (await response.json()) as ApiResponse<Career[]>;
};

export const fetchBlogs = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/blogs`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to load blogs');
  return (await response.json()) as ApiResponse<{ items: Blog[]; total: number; page: number; totalPages: number }>;
};
