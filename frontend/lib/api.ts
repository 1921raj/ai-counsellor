import axios from 'axios';

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // If we are on the production domain, default to the production backend
        if (window.location.hostname.includes('railway.app')) {
            return 'https://ai-counsellor-backend-production.up.railway.app';
        }
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

const API_BASE_URL = getBaseUrl();

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    signup: (data: { email: string; full_name: string; password: string }) =>
        api.post('/auth/signup', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    googleLogin: (token: string) => api.post('/auth/google', { token }),
    getMe: () => api.get('/auth/me'),
};

// Profile API
export const profileAPI = {
    create: (data: any) => api.post('/profile', data),
    get: () => api.get('/profile'),
    update: (data: any) => api.put('/profile', data),
    skipOnboarding: () => api.post('/skip-onboarding'),
};

// University API
export const universityAPI = {
    getAll: (filters?: {
        country?: string;
        scholarship?: boolean;
        min_tuition?: number;
        max_tuition?: number;
        min_ranking?: number;
        max_ranking?: number;
        major?: string
    }) => api.get('/universities', { params: filters }),
    getRecommendations: () => api.get('/universities/recommendations'),
    searchGlobal: (params: { country?: string; name?: string; limit?: number; offset?: number }) =>
        api.get('/external-universities/search', { params }),
    importExternal: (uniData: any) => api.post('/universities/import', uniData),
};

// Shortlist API
export const shortlistAPI = {
    add: (data: any) => api.post('/shortlist', data),
    getAll: () => api.get('/shortlist'),
    lock: (data: { shortlist_id: number; lock: boolean }) =>
        api.post('/shortlist/lock', data),
    remove: (id: number) => api.delete(`/shortlist/${id}`),
};

// Task API
export const taskAPI = {
    getAll: () => api.get('/tasks'),
    create: (data: any) => api.post('/tasks', data),
    update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
    delete: (id: number) => api.delete(`/tasks/${id}`),
};

// Chat API
export const chatAPI = {
    getHistory: () => api.get('/chat/history'),
    sendMessage: (data: { message: string; context?: any }) =>
        api.post('/chat', data),
};

// Dashboard API
export const dashboardAPI = {
    get: () => api.get('/dashboard'),
};
