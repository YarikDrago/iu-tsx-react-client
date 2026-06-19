import { io } from 'socket.io-client';

export const socket = io('/updates', {
  path: '/socket.io',
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: false,
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    socket.removeAllListeners();
    socket.disconnect();
  });
}
