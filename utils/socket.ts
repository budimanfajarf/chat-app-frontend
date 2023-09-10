import { io, Socket } from 'socket.io-client';
import env from '../constants/env.constant';

const SOCKET_EVENT = {
  // Client Events
  JOIN_CHAT_ROOM: 'JOIN_CHAT_ROOM',
  NEW_MESSAGE_CHAT_ROOM: 'NEW_MESSAGE_CHAT_ROOM',

  // Server Events
  JOINED_CHAT_ROOM: 'JOINED_CHAT_ROOM',
  BROADCAST_NEW_MESSAGE_CHAT_ROOM: 'BROADCAST_NEW_MESSAGE_CHAT_ROOM',
};

const socket: Socket = io(env.API_BASE_URL);

socket.on('connect', () => {
  console.log(`socket connected ${socket.id}`);
});

socket.on('disconnect', () => {
  console.log(`socket disconnected`);
});

export default socket;

export const joinChatRoom = (chatRoomId: string) => {
  socket.emit(SOCKET_EVENT.JOIN_CHAT_ROOM, { chatRoomId });
};
