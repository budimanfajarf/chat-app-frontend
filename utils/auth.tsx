export const USER_ID = 'userId';
import env from '@/constants/env.constant';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Read the userId from localStorage
    const storedUserId = localStorage.getItem(USER_ID);
    if (storedUserId) {
      setUserId(storedUserId);

      // Connect to the socket server
      setSocket(io(env.API_BASE_URL, { query: { userId: storedUserId } }));
    }
  }, []);

  const login = (userId: string) => {
    // Save the userId to localStorage
    localStorage.setItem(USER_ID, userId);
    setUserId(userId);

    // Connect to the socket server
    setSocket(io(env.API_BASE_URL, { query: { userId } }));
  };

  const logout = async () => {
    // Remove the userId from localStorage
    localStorage.removeItem(USER_ID);
    setUserId(null);

    // Disconnect from the socket server
    socket?.disconnect();
    setSocket(null);
  };

  return { userId, login, logout };
}
