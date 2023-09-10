export const USER_ID = 'userId';
import env from '@/constants/env.constant';
import { SOCKET_EVENT } from '@/constants/socket.constant';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  socket?.on('connect', () => {
    console.info(`Socket connected: ${socket?.id}`);
  });

  socket?.on('disconnect', () => {
    console.info(`Socket disconnected: ${socket?.id}`);
  });

  useEffect(() => {
    // Read the userId from localStorage
    const storedUserId = localStorage.getItem(USER_ID);
    if (storedUserId) {
      setUserId(storedUserId);

      // Connect to the socket server
      setSocket(io(env.SOCKET_SERVER_URL, { query: { userId: storedUserId } }));
    }
  }, []);

  const login = (userId: string) => {
    // Save the userId to localStorage
    localStorage.setItem(USER_ID, userId);
    setUserId(userId);

    // Connect to the socket server
    setSocket(io(env.SOCKET_SERVER_URL, { query: { userId } }));
  };

  const logout = async () => {
    // Remove the userId from localStorage
    localStorage.removeItem(USER_ID);
    setUserId(null);

    // Disconnect from the socket server
    socket?.disconnect();
    setSocket(null);
  };

  const joinChatRoom = (chatRoomId: string) => {
    return socket?.emit(SOCKET_EVENT.JOIN_CHAT_ROOM, { chatRoomId });
  };

  return { userId, login, logout, socket, joinChatRoom };
}
