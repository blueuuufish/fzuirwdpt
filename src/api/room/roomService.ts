import { ref, onUnmounted, defineEmits } from 'vue';
import { BehaviorSubject } from 'rxjs';
import { Room } from '@/shared/models/roomModel';
import { useRouter } from 'vue-router';
import { IMessage, StompSubscription } from '@stomp/stompjs';
import { throttle } from 'lodash-es';
import { PuzzlePiece } from '@/shared/models/puzzlePieceModel';
import { SocketDestinations } from '@/shared/enums/socketDestinationsEnum';
import { SocketEventType } from '@/shared/enums/socketEventTypeEnum';
import { RoomUser } from '@/shared/models/roomUserModel';
import { SocketMessage } from '@/shared/models/ws/socketMessageModel';
import { RoomUserJoinedDto } from '@/shared/models/dto/roomUserJoinedDto';
import { RoomUserLeftDto } from '@/shared/models/dto/roomUserLeftDto';
import { useSocketStore } from '../ws/socketStore';
import { RoomInitialDataDto } from '@/shared/models/dto/roomInitialDataDto';


export function useRoomService() {
  const emit = defineEmits(['roomEvent']);
  const roomSubject: BehaviorSubject<Room> = new BehaviorSubject({} as any);
  const stompSubscription = ref<StompSubscription | null>(null);

  const router = useRouter();
  const socketGameService = useSocketStore();

  const sendMoveMessage = (puzzlePiece: PuzzlePiece) => {
    if (roomSubject.value.id) {
      socketGameService.publish(
        `${SocketDestinations.Room}/${roomSubject.value.id}/puzzle/move`,
        { puzzlePiece }
      );
    }
  };

  const sendMoveMessageThrottle = throttle(sendMoveMessage, 50, {});
  const join = (id: string, initialDataCallback: Function | null = null) => {
    const sub =  socketGameService.subscribe(SocketDestinations.Room + "/" + id,
    (message: IMessage) => {
     const socketMessage: SocketMessage = JSON.parse(message.body);
     if(socketMessage.event === SocketEventType.Room_InitialData){
       const socketMessageBody: RoomInitialDataDto = socketMessage.body;

       socketMessageBody.room.users = socketMessageBody.room.users.map(user => new RoomUser(user.username, user.colorId));
       
       setRoomSubject(socketMessageBody.room);
       if(initialDataCallback !== null){
         initialDataCallback(socketMessageBody);
       }
     }
     receiveMessage(socketMessage);
     router.push('/room');
   })
   if(sub){
     stompSubscription.value = sub;
   }

  }
  // const join = async (id: string, initialDataCallback: Function | null = null) => {
  //   try {
  //     await socketGameService.connectClient('playerName');
  //     // 连接成功后订阅公共频道
  //     socketGameService.subscribe('/topic/all', (message) => {
  //       const body = JSON.parse(message.body);
  //       console.log('Message from server: ', body.message);
  //       // 处理接收到的 "hello world" 消息
  //     });

  //     // 连接成功后进行房间订阅
  //     stompSubscription.value = socketGameService.subscribe(
  //       `/QAQ${SocketDestinations.Room}/${id}`,
  //       (message: IMessage) => {
  //         const socketMessage = JSON.parse(message.body);
  //         if (socketMessage.event === SocketEventType.Room_InitialData) {
  //           const socketMessageBody = socketMessage.body;
  //           socketMessageBody.room.users = socketMessageBody.room.users || [];
  //           roomSubject.next(socketMessageBody.room);
  //           if (initialDataCallback) {
  //             initialDataCallback(socketMessageBody);
  //           }
  //         } else {
  //           emit('roomEvent', socketMessage);
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Failed to join room: ", error);
  //   }
  // };


  const setRoomSubject = (room: Room) => {
    roomSubject.next(room);
    console.log('save room');
  };

  const detach = () => {
    if (roomSubject.value.id) {
      socketGameService.unsubscribe(`${SocketDestinations.Room}/${roomSubject.value.id}`);
    }
    stompSubscription.value?.unsubscribe();
    stompSubscription.value = null;
  };

  const receiveMessage = (message: SocketMessage) => {
    if (message.event === SocketEventType.Room_UserJoined) {
      const messageBody: RoomUserJoinedDto = message.body;
      const roomUser: RoomUser = new RoomUser(messageBody.user.username, messageBody.user.colorId);

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

    emit('roomEvent', message);
  };

  const isJoined = () => {
    return stompSubscription.value != null;
  };

  const sendMovePuzzlePiece = (puzzlePiece: PuzzlePiece) => {
    sendMoveMessageThrottle(puzzlePiece);
  };

  const sendReleasePuzzlePiece = (puzzlePiece: PuzzlePiece) => {
    if (roomSubject.value.id) {
      socketGameService.publish(
        `${SocketDestinations.Room}/${roomSubject.value.id}/puzzle/release`,
        { puzzlePiece }
      );
    }
  };

  const getUserByUsername = (username: string): RoomUser | undefined => {
    if (!roomSubject.value.id) throw new Error("Room doesn't exist.");

    const room: Room = roomSubject.value;
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
