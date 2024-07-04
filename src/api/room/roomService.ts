import { ref, onUnmounted, defineEmits} from 'vue';
// TODO: 是否需要httpclient？
// import { useHttpClient } from './httpClient'; // 需要实现 HTTP 客户端的 composable
// TODO: rxjs
import { BehaviorSubject, Observable } from 'rxjs';
import {Room} from '@/shared/models/roomModel'
import { useRouter } from 'vue-router';
import { useSocketGameService } from '@/api/ws/socketGameService'; // 需要实现 SocketGameService 的 composable
import { IMessage, StompSubscription } from '@stomp/stompjs';
import { throttle } from 'lodash-es';
import { PuzzlePiece } from '@/shared/models/puzzlePieceModel';
import { SocketDestinations } from '@/shared/enums/socketDestinationsEnum';
import { SocketEventType } from '@/shared/enums/socketEventTypeEnum';
import { RoomUser } from '@/shared/models/roomUserModel';
import { SocketMessage } from '@/shared/models/ws/socketMessageModel';
import { RoomUserJoinedDto } from '@/shared/models/dto/roomUserJoinedDto';
import { RoomUserLeftDto } from '@/shared/models/dto/roomUserLeftDto';

// TODO: 检查逻辑是否一致

export function useRoomService() {
  const emit = defineEmits(['roomEvent']);
  // const roomSubject = ref({});
  const roomSubject: BehaviorSubject<Room>  = new BehaviorSubject({} as any);
  const stompSubscription = ref<StompSubscription | null>(null);

  // const httpClient = useHttpClient();
  const router = useRouter();
  const socketGameService = useSocketGameService();
  const sendMoveMessage = (puzzlePiece:PuzzlePiece) => {
    socketGameService.publish(
      SocketDestinations.Room+ "/" + roomSubject.value.id + "/puzzle/move",
      { puzzlePiece }
    );
  };

  const sendMoveMessageThrottle = throttle(sendMoveMessage, 50, {});


  const join = (id:string, initialDataCallback: Function | null = null) => {
    stompSubscription.value = socketGameService.subscribe(
      SocketDestinations.Room + "/" + id,
      (message:IMessage) => {
        const socketMessage = JSON.parse(message.body);
        if (socketMessage.event === SocketEventType.Room_InitialData) {
          const socketMessageBody = socketMessage.body;
          socketMessageBody.room.users = socketMessageBody.room.users.map(
            (user:RoomUser) => new RoomUser(user.username,user.colorId)
          );

          setRoomSubject(socketMessageBody.room);
          if (initialDataCallback !== null) {
            initialDataCallback(socketMessageBody);
          }
        }
        receiveMessage(socketMessage);
        router.push('/room');
      }
    );
  };

  const setRoomSubject = (room:Room) => {
    roomSubject.next(room);
  };

  const detach = () => {
    socketGameService.unsubscribe(SocketDestinations.Room + "/" + roomSubject.value.id);
    stompSubscription.value?.unsubscribe();
    stompSubscription.value = null;
  };

  const receiveMessage = (message:SocketMessage) => {
    if (message.event === SocketEventType.Room_UserJoined) {
      const messageBody: RoomUserJoinedDto= message.body;
      const roomUser:RoomUser = new RoomUser(messageBody.user.username,messageBody.user.colorId);

      if (roomUser.username === socketGameService.socketGameDataSubject.value?.username) {
        return;
      }

      setRoomSubject({
        ...roomSubject.value,
        users: [...roomSubject.value.users, roomUser],
      });
    } else if (message.event === SocketEventType.Room_UserLeft) {
      const messageBody: RoomUserLeftDto = message.body;
      setRoomSubject({
        ...roomSubject.value,
        users: roomSubject.value.users.filter(
          (user) => user.username !== messageBody.user.username
        ),
      });
    }

    emit('roomEvent',message)
  };

  const isJoined = () => {
    return stompSubscription.value != null;
  };

  const sendMovePuzzlePiece = (puzzlePiece:PuzzlePiece) => {
    sendMoveMessageThrottle(puzzlePiece);
  };



  const sendReleasePuzzlePiece = (puzzlePiece:PuzzlePiece) => {
    socketGameService.publish(
      SocketDestinations.Room + "/" +roomSubject.value.id + "/puzzle/release",
      { puzzlePiece }
    );
  };

  const getUserByUsername = (username:string): RoomUser | undefined => {
    if (!roomSubject.value.id) throw new Error("Room doesn't exist.");

    const room:Room = roomSubject.value;
    return room.users.find((user) => user.username === username);
  };

  // onUnmounted(() => {
  //   detach();
  // });

  return {
    roomSubject,
    join,
    detach,
    isJoined,
    sendMovePuzzlePiece,
    sendReleasePuzzlePiece,
    getUserByUsername,
  };
}
