import { Server as IServer } from 'http';
import { Server as RealtimeServer, Socket } from 'socket.io';

let io: RealtimeServer;

export const useSocketIo = (server: IServer): RealtimeServer => {
  io = new RealtimeServer(server, {
    transports: ['polling', 'websocket'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });

    socket.on('join', (userId) => {
      socket.join(userId);
    });
  });

  return io;
};

// Export the `io` instance
export const getIo = (): RealtimeServer => {
  console.log('io>', io);
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
