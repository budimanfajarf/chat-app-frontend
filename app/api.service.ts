import env from '@/app/env.constant';
import axios from 'axios';

const instance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export async function getChatRoomData() {
  const { data } = await instance.get('/v1/chat-rooms');
  return data;
}

export default instance;
