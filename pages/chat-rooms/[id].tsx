import { SOCKET_EVENT } from '@/constants/socket.constant';
import { Chat, ChatRoom } from '@/types/model.type';
import apiService from '@/utils/api.service';
import { useAuth, useAuthRedirect } from '@/utils/useAuth';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { LoadingSpinner } from '@/components/Loading';
import { ErrorBox } from '@/components/ErrorBox';

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

      throw new Error('Failed connect to server');
    }

    throw new Error('Unknown error');
  }
}

export default function ChatRoomPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { user, socket, sendMessageChatRoom, deleteMessageChatRoom } = useAuth(); // Updated to use `user` instead of `userId`
  const [data, setData] = useState<Omit<ChatRoom, 'chats'>>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useAuthRedirect({ user });

  useEffect(() => {
    if (id) {
      getChatRoomData(id)
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
      sendMessageChatRoom({ chatRoomId: id, message: trimmedNewMessage });

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

  const deleteChat = ({ chatId, chatRoomId }: { chatId: string; chatRoomId: string }) => {
    console.log({ chatId, chatRoomId });
    const confirmed = confirm('Are you sure you want to delete this chat?');

    if (confirmed) {
      deleteMessageChatRoom({ chatRoomId, chatId });
    }
  };

  socket?.on(
    SOCKET_EVENT.DELETED_MESSAGE_CHAT_ROOM,
    (payload: { chatRoomId: string; chatId: string }) => {
      const { chatRoomId, chatId } = payload;

      if (chatRoomId === id) {
        const newChats = chats.filter((chat) => chat._id !== chatId);
        setChats(newChats);
      }
    }
  );

  return (
    <div className="w-[85vw] lg:w-[70vw] ">
      <LoadingSpinner isLoading={loading} />
      <ErrorBox error={error} />

      {!loading && !error && (
        <>
          <div className="text-center mt-12 lg:mt-0">
            <h1 className="text-3xl">{data?.name}</h1>
            <small className="text-gray-500">created {moment(data?.createdAt).fromNow()}</small>
          </div>
          <p className="mt-4">
            <strong>Participants</strong>: {data?.participants.map((p) => p.name).join(', ')}
          </p>

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
                    {isCurrentUser && (
                      <button
                        onClick={(e) => deleteChat({ chatId: chat._id, chatRoomId: id })}
                        className="ml-2 text-red-500"
                      >
                        <small>delete</small>
                      </button>
                    )}
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
        </>
      )}
    </div>
  );
}
