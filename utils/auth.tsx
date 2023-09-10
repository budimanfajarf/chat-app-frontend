const USER_ID = 'userId';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Read the userId from localStorage
    const storedUserId = localStorage.getItem(USER_ID);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const login = (userId: string) => {
    // Save the userId to localStorage
    localStorage.setItem(USER_ID, userId);
    setUserId(userId);
  };

  const logout = async () => {
    // Remove the userId from localStorage
    localStorage.removeItem(USER_ID);
    setUserId(null);
  };

  return { userId, login, logout };
}
