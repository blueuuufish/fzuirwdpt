import { onUnmounted } from 'vue';
// import { useAuthStorage } from '@/api/auth/authStorageService'; // 假设 useAuthStorage 是你定义的 composable
import { useSocketClient } from '@/api/ws/socketClientService'; // 假设 useSocketClient 是你定义的 composable
import { BehaviorSubject } from 'rxjs';
import { StompSubscription, messageCallbackType } from '@stomp/stompjs';
import { SocketGameData } from '@/shared/models/ws/SocketGameDataModel';

export function useSocketGameService() {
  const socketGameDataSubject:BehaviorSubject<SocketGameData | null> = new BehaviorSubject<SocketGameData | null>(null)

  // const authStorageService = useAuthStorage();
  const socketClientService = useSocketClient();

  const connect = (playerName = null) => {
    let headers:any = {};
    headers["Player-Name"] = playerName ?? "";
    // if (authStorageService.getToken()) {
    //   headers["Authorization"] = `Bearer ${authStorageService.getToken()}`;
    // } else {
    //   headers["Player-Name"] = playerName ?? "";
    // }

    socketClientService.initializeWebSocketConnection(headers, (frame:any) => onConnect(frame));
  };

  const disconnect = () => {
    socketClientService.disconnectWebSocketConnection();
    setSocketGameData(null);
  };

  const publish = (destination:string, body:any) => {
    socketClientService.publish("/app" + destination, body);
  };

  const subscribe = (destination:string, callback: messageCallbackType) => {
    return socketClientService.subscribe("/topic" + destination, callback);
  };

  const subscribeUser = (destination: string, callback: messageCallbackType): StompSubscription => {
    return socketClientService.subscribe("/user/topic" + destination, callback);
  };

  const unsubscribe = (destination:string) => {
    socketClientService.unsubscribe("/topic" + destination);
  };

  const unsubscribeUser = (destination:string) => {
    socketClientService.unsubscribe("/user/topic" + destination);
  };

  const getUsername = () => {
    return socketGameDataSubject.value?.username;
  };

  const onConnect = (frame:any) => {
    setSocketGameData({ username: frame.headers["user-name"] });
  };

  const setSocketGameData = (socketGameData: SocketGameData| null) => {
    // console.log(socketGameData)
    socketGameDataSubject.next(socketGameData)
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    socketGameDataSubject,
    connect,
    disconnect,
    publish,
    subscribe,
    subscribeUser,
    unsubscribe,
    unsubscribeUser,
    getUsername,
  };
}
