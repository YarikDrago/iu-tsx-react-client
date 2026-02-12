import { io, Socket } from 'socket.io-client';

type ServerToClientEvents = {
  lastUpdate: (payload: { lastUpdateAt: string | null }) => void;
};

type ClientToServerEvents = {
  /* This event for sending messages to server */
};

const WS_URL = (process.env.REACT_APP_WS_URL ?? process.env.API_URL) as string;
const WS_NAMESPACE = '/updates';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `${WS_URL}${WS_NAMESPACE}`,
  {
    withCredentials: true,
    transports: ['websocket'], // Options: for websocket work without long-pulling
  }
);
