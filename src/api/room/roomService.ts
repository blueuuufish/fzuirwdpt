import { ref, onUnmounted, inject } from 'vue';
import { useThrottle } from '@vueuse/core';
// TODO: 是否需要httpclient？
// import { useHttpClient } from './httpClient'; // 需要实现 HTTP 客户端的 composable
// TODO: rxjs
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {Room} from '@/shared/models/roomModel'
import { useRouter } from 'vue-router';
import { useSocketGameService } from '@/api/ws/socketGameService'; // 需要实现 SocketGameService 的 composable

// TODO: 检查逻辑是否一致

export function useRoomService() {
  const roomEvent = ref([]);
  // const roomSubject = ref({});
  const roomSubject: BehaviorSubject<Room>  = new BehaviorSubject({} as any);
  const stompSubscription = ref(null);

  // const httpClient = useHttpClient();
  const router = useRouter();
  const socketGameService = useSocketGameService();

  const sendMoveMessageThrottle = useThrottle((puzzlePiece) => {
    sendMoveMessage(puzzlePiece);
  }, 50);

  const join = (id, initialDataCallback = null) => {
    stompSubscription.value = socketGameService.subscribe(
      `SocketDestinations.Room/${id}`,
      (message) => {
        const socketMessage = JSON.parse(message.body);
        if (socketMessage.event === 'Room_InitialData') {
          const socketMessageBody = socketMessage.body;
          socketMessageBody.room.users = socketMessageBody.room.users.map(
            (user) => ({ ...user })
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

  const setRoomSubject = (room) => {
    roomSubject.value = room;
  };

  const detach = () => {
    socketGameService.unsubscribe(`SocketDestinations.Room/${roomSubject.value.id}`);
    stompSubscription.value?.unsubscribe();
    stompSubscription.value = null;
  };

  const receiveMessage = (message) => {
    if (message.event === 'Room_UserJoined') {
      const messageBody = message.body;
      const roomUser = { ...messageBody.user };

      if (roomUser.username === socketGameService.socketGameData.value?.username) {
        return;
      }

      setRoomSubject({
        ...roomSubject.value,
        users: [...roomSubject.value.users, roomUser],
      });
    } else if (message.event === 'Room_UserLeft') {
      const messageBody = message.body;
      setRoomSubject({
        ...roomSubject.value,
        users: roomSubject.value.users.filter(
          (user) => user.username !== messageBody.user.username
        ),
      });
    }

    roomEvent.value.push(message);
  };

  const isJoined = () => {
    return stompSubscription.value != null;
  };

  const sendMovePuzzlePiece = (puzzlePiece) => {
    sendMoveMessageThrottle(puzzlePiece);
  };

  const sendMoveMessage = (puzzlePiece) => {
    socketGameService.publish(
      `SocketDestinations.Room/${roomSubject.value.id}/puzzle/move`,
      { puzzlePiece }
    );
  };

  const sendReleasePuzzlePiece = (puzzlePiece) => {
    socketGameService.publish(
      `SocketDestinations.Room/${roomSubject.value.id}/puzzle/release`,
      { puzzlePiece }
    );
  };

  const getUserByUsername = (username) => {
    if (!roomSubject.value.id) throw new Error("Room doesn't exist.");

    const room = roomSubject.value;
    return room.users.find((user) => user.username === username);
  };

  onUnmounted(() => {
    detach();
  });

  return {
    roomEvent,
    roomSubject,
    join,
    detach,
    isJoined,
    sendMovePuzzlePiece,
    sendReleasePuzzlePiece,
    getUserByUsername,
  };
}
