import { ref, onUnmounted } from 'vue';
import { useAuthStorage } from '@/api/auth/authStorageService'; // 假设 useAuthStorage 是你定义的 composable
import { useSocketClient } from '@/api/ws/socketClientService'; // 假设 useSocketClient 是你定义的 composable

// TODO: 检查逻辑是否一致
export function useSocketGameService() {
  const socketGameDataSubject = ref(null);

  const authStorageService = useAuthStorage();
  const socketClientService = useSocketClient();

  const connect = (playerName = null) => {
    let headers = {};

    if (authStorageService.getToken()) {
      headers["Authorization"] = `Bearer ${authStorageService.getToken()}`;
    } else {
      headers["Player-Name"] = playerName ?? "";
    }

    socketClientService.initializeWebSocketConnection(headers, (frame) => onConnect(frame));
  };

  const disconnect = () => {
    socketClientService.disconnectWebSocketConnection();
    setSocketGameData(null);
  };

  const publish = (destination, body) => {
    socketClientService.publish("/app" + destination, body);
  };

  const subscribe = (destination, callback) => {
    return socketClientService.subscribe("/topic" + destination, callback);
  };

  const subscribeUser = (destination, callback) => {
    return socketClientService.subscribe("/user/topic" + destination, callback);
  };

  const unsubscribe = (destination) => {
    socketClientService.unsubscribe("/topic" + destination);
  };

  const unsubscribeUser = (destination) => {
    socketClientService.unsubscribe("/user/topic" + destination);
  };

  const getUsername = () => {
    return socketGameDataSubject.value?.username;
  };

  const onConnect = (frame) => {
    setSocketGameData({ username: frame.headers["user-name"] });
  };

  const setSocketGameData = (socketGameData) => {
    socketGameDataSubject.value = socketGameData;
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
