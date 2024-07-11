import { defineStore } from 'pinia';
import { RoomService,useRoomService } from './roomService';
import { BehaviorSubject } from 'rxjs';
import { Room } from '@/shared/models/roomModel';
import { PuzzlePiece } from '@/shared/models/puzzlePieceModel';
import { RoomUser } from '@/shared/models/roomUserModel';
import { SocketMessage } from '@/shared/models/ws/socketMessageModel';

interface RoomState {
  client: RoomService | null;
  roomSubject: BehaviorSubject<Room>;
  messageSubject: BehaviorSubject<SocketMessage>;
}

export const useRoomStore = defineStore('room', {
  state: (): RoomState => ({
    client: null,
    roomSubject: new BehaviorSubject<Room>({} as any),
    messageSubject: new BehaviorSubject<SocketMessage>({} as any)
  }),
  actions: {
    initializeClient() {
      if (!this.client) {
        this.client = useRoomService();
        this.roomSubject = this.client.roomSubject;
        this.messageSubject = this.client.messageSubject;
        // const room = this.client.roomSubject;
        // if (room){
        //   this.roomSubject = room;
        // }
      }
    },
    join(id: string,initialDataCallback: Function|null =null):void{
      if (this.client) {
        this.client.join(id,initialDataCallback);
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
    isJoined(): boolean|undefined{
      if (this.client) {
        return this.client.isJoined();
      } else {
        console.error('Client not initialized');
      }
    },
    sendMovePuzzlePiece(puzzlePiece: PuzzlePiece){
      if (this.client) {
        this.client.sendMovePuzzlePiece(puzzlePiece);
      } else {
        console.error('Client not initialized');
      }
    },
    sendReleasePuzzlePiece(puzzlePiece: PuzzlePiece) {
      if (this.client) {
        this.client.sendReleasePuzzlePiece(puzzlePiece);
      } else {
        console.error('Client not initialized');
      }
    },
    getUserByUsername(username: string): RoomUser | undefined {
      if (this.client) {
        return this.client.getUserByUsername(username);
      } else {
        console.error('Client not initialized');
      }
    },
  },
});
