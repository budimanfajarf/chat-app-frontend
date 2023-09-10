import { io, Socket } from 'socket.io-client';
import env from './env.constant';

const socket: Socket = io(env.API_BASE_URL);

export default socket;
