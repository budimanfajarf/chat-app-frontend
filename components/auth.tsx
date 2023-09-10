import { useEffect, useState } from 'react';

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Read the userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const login = (userId: string) => {
    // Save the userId to localStorage
    localStorage.setItem('userId', userId);
    setUserId(userId);
  };

  const logout = () => {
    // Remove the userId from localStorage
    localStorage.removeItem('userId');
    setUserId(null);
  };

  return { userId, login, logout };
}
