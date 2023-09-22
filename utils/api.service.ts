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

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.log({
      code: error.code,
      status: error.response?.status,
      error: error.response?.data,
    });

    throw new Error('Failed connect to server');
  }

  throw new Error('Unknown error');
};

export const getChatRoomsData = async () => {
  try {
    return (await apiService.get<ChatRoomsData>('/v1/chat-rooms'))?.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getChatRoomData = async (id: string) => {
  try {
    return (await apiService.get<ChatRoom>(`/v1/chat-rooms/${id}`))?.data;
  } catch (error) {
    return handleError(error);
  }
};
