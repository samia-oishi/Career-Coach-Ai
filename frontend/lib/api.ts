import axios from 'axios';
import type { ApiResponse, Blog, Career } from './types';

// Backend URL - MUST be full URL for cross-domain requests
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Always use full backend URL - required for separate Vercel deployments
const getBaseURL = () => {
  return BACKEND_URL;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication required');
    } else if (!error.response) {
      console.error('Network error - is the backend server running?');
    }
    return Promise.reject(error);
  }
);

export const fetchCareers = async (params?: Record<string, string>) => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  const response = await fetch(`${BACKEND_URL}/careers${query}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to load careers');
  return (await response.json()) as ApiResponse<{ items: Career[]; total: number; page: number; totalPages: number }>;
};

export const fetchFeaturedCareers = async () => {
  const response = await fetch(`${BACKEND_URL}/careers/featured`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to load featured careers');
  return (await response.json()) as ApiResponse<Career[]>;
};

export const fetchBlogs = async () => {
  const response = await fetch(`${BACKEND_URL}/blogs`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to load blogs');
  return (await response.json()) as ApiResponse<{ items: Blog[]; total: number; page: number; totalPages: number }>;
};
