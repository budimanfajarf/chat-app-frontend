import env from '@/constants/env.constant';
import { ChatRoom, ChatRoomsData } from '@/types/model.type';
import axios, { AxiosError } from 'axios';

const apiService = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default apiService;

export const getChatRoomsData = async () => {
  try {
    const { data } = await apiService.get<ChatRoomsData>('/v1/chat-rooms');
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log({
        code: error.code,
        status: error.response?.status,
        error: error.response?.data,
      });

      throw new Error('Failed connect to server');
    }

    throw new Error('Unknown error');
  }
};

export const getChatRoomData = async (id: string) => {
  try {
    const { data } = await apiService.get<ChatRoom>(`/v1/chat-rooms/${id}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log({
        code: error.code,
        status: error.response?.status,
        error: error.response?.data,
      });

      throw new Error('Failed connect to server');
    }

    throw new Error('Unknown error');
  }
};
