import { ChatRoom, ChatRoomsData } from '@/types/model.type';
import apiService from '@/utils/api.service';
import { useAuth } from '@/utils/useAuth';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

async function getChatRoomData(id: string) {
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

      throw new Error('Failed to fetch data');
    }

    throw new Error('Unknown error');
  }
}

export default function ChatRoomPage() {
  const router = useRouter();
  const { id } = router.query;
  const { userId, socket } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ChatRoom>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId && !isLoading) {
      router.push('/login');
    }
    setIsLoading(false);
  }, [userId, router, isLoading]);

  useEffect(() => {
    setLoading(true);

    if (id) {
      getChatRoomData(id as string)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-3xl text-center mt-12 lg:mt-0">{data?.name}</h1>
      <p className="mt-2">Participants: {data?.participants.map((p) => p.name).join(', ')}</p>

      {loading && <p className="text-center text-lg mt-10">Loading...</p>}

      {error && <p className="text-center text-lg mt-10">{error}</p>}

      <div className="fixed inset-0 overflow-scroll mx-auto mt-48 lg:mt-64 grid gap-4 lg:gap-8 bg-slate-500 w-[80vw] lg:w-[70vw] p-8 lg:p-20 rounded-2xl pb-60">
        {data?.chats.map((chat) => {
          const user = chat.user[0];
          // const isCurrentUser = user._id === userId;
          const isCurrentUser = false;

          let className =
            'w-2/3 p-4 lg:p-6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30';

          if (isCurrentUser) {
            className += ' ml-auto';
          }

          return (
            <div key={chat._id} className={className}>
              {!isCurrentUser && <p className="text-sm font-medium mb-1">~ {user.name}</p>}
              <p>{chat.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
