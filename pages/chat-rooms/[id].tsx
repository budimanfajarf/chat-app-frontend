import { SOCKET_EVENT } from '@/constants/socket.constant';
import { Chat, ChatRoom } from '@/types/model.type';
import apiService from '@/utils/api.service';
import { useAuth, useAuthRedirect } from '@/utils/useAuth';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment from 'moment';

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
  const { user, socket, sendMessageChatRoom } = useAuth(); // Updated to use `user` instead of `userId`
  const [data, setData] = useState<Omit<ChatRoom, 'chats'>>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useAuthRedirect({ user });

  useEffect(() => {
    setLoading(true);

    if (id) {
      getChatRoomData(id as string)
        .then((res) => {
          const { chats, ...rest } = res;
          setData(rest);
          setChats(chats);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const [newMessage, setNewMessage] = useState('');

  // Function to handle input changes
  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  // Function to handle form submission
  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedNewMessage = newMessage.trim();

    // Check if the message is not empty
    if (trimmedNewMessage !== '') {
      // Emit the message to the Socket.io server
      sendMessageChatRoom({ chatRoomId: id as string, message: trimmedNewMessage });

      // Clear the input field after sending
      setNewMessage('');
    }
  };

  socket?.on(
    SOCKET_EVENT.BROADCAST_NEW_MESSAGE_CHAT_ROOM,
    (payload: { chatRoomId: string; chat: Chat }) => {
      const { chatRoomId, chat } = payload;

      if (chatRoomId === id && !chats.some((existingChat) => existingChat._id === chat._id)) {
        setChats([...chats, chat]);
      }
    }
  );

  return (
    <div className="w-[85vw] lg:w-[70vw] ">
      <div className="text-center mt-12 lg:mt-0">
        <h1 className="text-3xl">{data?.name}</h1>
        <small className="text-gray-500">created {moment(data?.createdAt).fromNow()}</small>
      </div>
      <p className="mt-4">
        <strong>Participants</strong>: {data?.participants.map((p) => p.name).join(', ')}
      </p>

      {loading && <p className="text-center text-lg mt-10">Loading...</p>}

      {error && <p className="text-center text-lg mt-10">{error}</p>}

      <div className="mt-4 grid gap-4 lg:gap-8 bg-slate-500 p-6 lg:p-20 rounded-2xl pb-60">
        {chats.map((chat) => {
          const chatUser = chat.user;
          const isCurrentUser = chatUser._id === user?._id; // Updated to check user._id

          let className =
            'w-9/12 p-4 lg:p-6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30';

          if (isCurrentUser) {
            className += ' ml-auto';
          }

          return (
            <div key={chat._id} className={className}>
              {!isCurrentUser && (
                <p className="text-sm font-medium mb-1 text-gray-400">~ {chatUser.name}</p>
              )}
              <p>{chat.message}</p>
              <p className="text-right text-gray-400">
                <small>{moment(chat.createdAt).fromNow()}</small>
              </p>
            </div>
          );
        })}
        <form onSubmit={handleSubmitMessage}>
          <input
            placeholder="Type your message"
            className="outline-none ml-auto w-full p-4 lg:p-6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30"
            value={newMessage}
            onChange={handleNewMessageChange}
          />
        </form>
      </div>
    </div>
  );
}
