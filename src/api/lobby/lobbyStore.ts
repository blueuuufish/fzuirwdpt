import { defineStore } from 'pinia';
import { LobbyService, useLobbyService } from './lobbyService';
import { BehaviorSubject } from 'rxjs';
import { Room } from '@/shared/models/roomModel';
import {LobbyCreateRoomDto} from '@/shared/models/dto/lobbyCreateRoomDto';

interface LobbyState {
  client: LobbyService | null;
  creatingRoomSubject: BehaviorSubject<boolean>;
  roomListSubject: BehaviorSubject<Room[]>;
}

export const useLobbyStore = defineStore('lobby', {
  state: (): LobbyState => ({
    client: null,
    creatingRoomSubject: new BehaviorSubject<boolean>(false),
    roomListSubject: new BehaviorSubject<Room[]>([]),
  }),
  actions: {
    initializeClient() {
      if (!this.client) {
        this.client = useLobbyService();
        this.creatingRoomSubject = this.client.creatingRoomSubject;
        this.roomListSubject = this.client.roomListSubject;
      }
    },
    join(initialDataCallback: Function):void{
      if (this.client) {
        this.client.join(initialDataCallback);
      } else {
        console.error('Client not initialized');
      }
    },
    setRoomListSubject(roomList : Room[]): void{
      if (this.client) {
        this.client.setRoomListSubject(roomList);
      } else {
        console.error('Client not initialized');
      }
    },
    detach(): void{
      if (this.client) {
        this.client.detach();
      } else {
        console.error('Client not initialized');
      }
    },
    createRoom(lobbyCreateRoom: LobbyCreateRoomDto, imageFile: File): void{
      if (this.client) {
        this.client.createRoom(lobbyCreateRoom,imageFile);
      } else {
        console.error('Client not initialized');
      }
    },
    changeCreatingRoom(creatingRoom: boolean): void{
      if (this.client) {
        this.client.changeCreatingRoom(creatingRoom);
      } else {
        console.error('Client not initialized');
      }
    },
  },
});
