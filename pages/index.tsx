import { ChatRoomsData } from '@/types/model.type';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import apiService from '@/utils/api.service';
import { useAuth, useAuthRedirect } from '@/utils/useAuth';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '@/components/Loading';
import { ErrorBox } from '@/components/ErrorBox';

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

      throw new Error('Failed connect to server');
    }

    throw new Error('Unknown error');
  }
}

export default function Home() {
  const { user, socket, joinChatRoom } = useAuth(); // Updated to use `user` instead of `userId`
  const router = useRouter();
  const [data, setData] = useState<ChatRoomsData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useAuthRedirect({ user });

  useEffect(() => {
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

  const handleJoinChatRoom = (chatRoomId: string) => {
    joinChatRoom(chatRoomId);

    // Redirect to the chat room
    router.push(`/chat-rooms/${chatRoomId}`);
  };

  return (
    <div className="mt-16 mb-48 lg:mt-0 lg:mb-16">
      <h1 className="text-3xl text-center">Chat Rooms</h1>

      <LoadingSpinner isLoading={loading} />
      <ErrorBox error={error} />

      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {!loading &&
          !error &&
          data.map((room) => (
            <div
              key={room._id}
              className="p-8 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static w-auto  rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30"
            >
              <h2 className="text-xl text-center">{room.name}</h2>
              <button
                onClick={() => handleJoinChatRoom(room._id)}
                className="px-4 py-2 bg-teal-500 rounded-lg w-full mt-4 font-medium"
              >
                Join
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
