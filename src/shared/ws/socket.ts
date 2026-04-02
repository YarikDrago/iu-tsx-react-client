import { io } from 'socket.io-client';

export const socket = io('/updates', {
  path: '/socket.io',
  // transports: ['websocket'],
  withCredentials: true,
});
