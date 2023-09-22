import env from '@/constants/env.constant';
import { SOCKET_EVENT } from '@/constants/socket.constant';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const USER_DATA = 'user-data';
type User = { _id: string; name: string };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  socket?.on('connect', () => {
    console.info(`Socket connected: ${socket?.id}`);
  });

  socket?.on('disconnect', () => {
    console.info(`Socket disconnected: ${socket?.id}`);
  });

  useEffect(() => {
    // Read the user data from localStorage
    const storedUserData = localStorage.getItem(USER_DATA);
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUser(parsedUserData);

      // Connect to the socket server
      setSocket(io(env.SOCKET_SERVER_URL, { query: { userId: parsedUserData._id } }));
    }
  }, []);

  const login = (userData: { _id: string; name: string }) => {
    // Save the user data to localStorage
    localStorage.setItem(USER_DATA, JSON.stringify(userData));
    setUser(userData);

    // Connect to the socket server
    setSocket(io(env.SOCKET_SERVER_URL, { query: { userId: userData._id } }));
  };

  const logout = async () => {
    // Remove the user data from localStorage
    localStorage.removeItem(USER_DATA);
    setUser(null);

    // Disconnect from the socket server
    socket?.disconnect();
    setSocket(null);
  };

  const joinChatRoom = (chatRoomId: string) => {
    socket?.emit(SOCKET_EVENT.JOIN_CHAT_ROOM, { chatRoomId });
  };

  const sendMessageChatRoom = (payload: { chatRoomId: string; message: string }) => {
    socket?.emit(SOCKET_EVENT.NEW_MESSAGE_CHAT_ROOM, payload);
  };

  const deleteMessageChatRoom = (payload: { chatRoomId: string; chatId: string }) => {
    socket?.emit(SOCKET_EVENT.DELETE_MESSAGE_CHAT_ROOM, payload);
  };

  return { user, login, logout, socket, joinChatRoom, sendMessageChatRoom, deleteMessageChatRoom };
}

export function useAuthRedirect({
  user,
  redirectTo = '/login',
}: {
  user: User | null;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('Redirecting to login page');
      router.push(redirectTo);
    }
    setIsLoading(false);
  }, [router, user, redirectTo, isLoading]);
}
