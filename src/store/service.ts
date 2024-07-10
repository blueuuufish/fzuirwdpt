// stores/socket.ts
import { defineStore } from 'pinia';
import { useSocketClient } from '@/api/ws/socketClientService';
import { useSocketGameService } from '@/api/ws/socketGameService';
import { useLobbyService } from '@/api/lobby/lobbyService';
import { useRoomService } from '@/api/room/roomService';

export const useServiceStore = defineStore('service', () => {
  const socketGameService = useSocketGameService();
  const socketClient = useSocketClient();

  const lobbyService = useLobbyService();
  const roomService = useRoomService();
  

  return {
    socketGameService,
    socketClient,
    lobbyService,
    roomService
  };
});
