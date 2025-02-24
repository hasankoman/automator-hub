import { ref, onMounted, onBeforeUnmount } from 'vue';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = () => {
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);

  const connect = () => {
    socket.value = io({
      path: '/ws',
      autoConnect: true,
      reconnection: true,
    });

    socket.value.on('connect', () => {
      isConnected.value = true;
      console.log('Socket.IO connected');
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
      console.log('Socket.IO disconnected');
    });
  };

  const subscribe = (channel: string, callback: (data: any) => void) => {
    if (!socket.value) return;

    socket.value.emit('subscribe', channel);
    socket.value.on(channel, callback);
  };

  onMounted(() => {
    connect();
  });

  onBeforeUnmount(() => {
    if (socket.value) {
      socket.value.disconnect();
    }
  });

  return {
    socket,
    isConnected,
    subscribe
  };
}; 