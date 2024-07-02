import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// TODO: 检查逻辑是否一致
export function useSocketClient() {
  let stompClient = null;

  const initializeWebSocketConnection = (headers, onConnect) => {
    const socket = new SockJS('/your-websocket-endpoint'); // 替换为你的实际 WebSocket 端点
    stompClient = Stomp.over(socket);
    stompClient.connect(headers, onConnect);
  };

  const disconnectWebSocketConnection = () => {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
  };

  const publish = (destination, body) => {
    if (stompClient !== null) {
      stompClient.send(destination, {}, JSON.stringify(body));
    }
  };

  const subscribe = (destination, callback) => {
    if (stompClient !== null) {
      return stompClient.subscribe(destination, callback);
    }
  };

  const unsubscribe = (subscription) => {
    if (subscription !== null) {
      subscription.unsubscribe();
    }
  };

  return {
    initializeWebSocketConnection,
    disconnectWebSocketConnection,
    publish,
    subscribe,
    unsubscribe,
  };
}
