import env from '@/app/env.constant';
import axios from 'axios';

const apiService = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default apiService;
