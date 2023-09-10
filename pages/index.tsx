'use client';
import { ChatRoomsData } from '@/types/model.type';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import apiService from '@/utils/api.service';
import { useAuth } from '@/utils/useAuth';
import { useRouter } from 'next/router';

async function getChatRoomsData() {
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

      throw new Error('Failed to fetch data');
    }

    throw new Error('Unknown error');
  }
}

export default function Home() {
  const { userId, socket } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<ChatRoomsData>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId && !isLoading) {
      console.log('Redirecting to login page');
      router.push('/login');
    }
    setIsLoading(false);
  }, [userId, router, isLoading]);

  useEffect(() => {
    setLoading(true);
    getChatRoomsData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-center">Chat Rooms</h1>

      {loading && <p className="text-center text-lg mt-10">Loading...</p>}

      {error && <p className="text-center text-lg mt-10">{error}</p>}

      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {data.map((room) => (
          <div
            key={room._id}
            className="p-8 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static w-auto  rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30"
          >
            <h2 className="text-xl">{room.name}</h2>
            <button className="px-4 py-2 bg-teal-500 rounded-lg w-full mt-3 font-medium">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
