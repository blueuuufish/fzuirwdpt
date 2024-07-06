import SockJS from 'sockjs-client';
import { Stomp, CompatClient, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import { environment } from '@/environments/environment';

export function useSocketClient() {
  let stompClient: CompatClient;

  const initializeWebSocketConnection = (connectHeaders: any, connectCallback: Function) => {
    const ws = new SockJS(environment.wsApiUrl);
    stompClient = Stomp.over(() => ws);
    stompClient.onConnect = (frame: any) => {
      onConnect(frame);
      connectCallback(frame);
    };
    stompClient.onWebSocketClose = onError;
    stompClient.onDisconnect = onError;
    stompClient.onStompError = onError;
    stompClient.connectHeaders = connectHeaders;
    stompClient.activate();
  };

  const onConnect = (frame: any) => {
    console.log("socketClientService的onConnect函数被触发了");
    // 测试：发送 "hello world" 消息给所有客户端
    stompClient.publish({
      destination: '/topic/all', // 全体的频道
      body: JSON.stringify({ message: 'hello noob' })
    });
  };


  const onError = (error: any) => {
    console.error("WebSocket Error: ", error);
  };

  const disconnectWebSocketConnection = () => {
    stompClient.disconnect();
  };

  const publish = (destination: string, body: any) => {
    console.log("socketClientService的publish函数被触发了");
    stompClient.publish({
      destination,
      body: JSON.stringify(body)
    });
  };

  const subscribe = (destination: string, callback: messageCallbackType): StompSubscription => {
    console.log("socketClientService的subscribe函数被触发了");
    return stompClient.subscribe(destination, callback);
  };

  const unsubscribe = (destination: string) => {
    stompClient.unsubscribe(destination);
  };

  const subscribeToAll = () => {
    console.log("socketClientService的subscribeToAll函数被触发了");
    stompClient.subscribe('/topic/all', (message) => {
      const body = JSON.parse(message.body);
      console.log('Message from server: ', body.message);
      // 处理接收到的 "hello world" 消息
    });
  };

  // 调用订阅函数
  subscribeToAll();

  return {
    initializeWebSocketConnection,
    disconnectWebSocketConnection,
    publish,
    subscribe,
    unsubscribe,
  };
}
