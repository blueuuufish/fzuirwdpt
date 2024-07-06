import SockJS from 'sockjs-client';
import { Stomp, CompatClient, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '@/environments/environment';
import { SocketGameData } from '@/shared/models/ws/SocketGameDataModel';

export interface SocketGameService {
  connect(playerName: string | null): Promise<void>;
  disconnect(): void;
  publish(destination: string, body: any): void;
  subscribe(destination: string, callback: messageCallbackType): StompSubscription | null;
  subscribeUser(destination: string, callback: messageCallbackType): StompSubscription | null;
  unsubscribe(destination: string): void;
  unsubscribeUser(destination: string): void;
  getUsername(): string | undefined;
  socketGameDataSubject: BehaviorSubject<SocketGameData | null>;
}

export function useSocketGameService(): SocketGameService {
  let stompClient: CompatClient | null = null;

  const socketGameDataSubject = new BehaviorSubject<SocketGameData | null>(null);

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
    console.log("socketGameService的onConnect函数被触发了");
    stompClient?.publish({
      destination: '/topic/all',
      body: JSON.stringify({ message: 'hello world' }),
    });
  };

  const onError = (error: any) => {
    console.error('WebSocket Error: ', error);
  };

  const connect = (playerName: string | null): Promise<void> => {
    console.log("socketGameService的connect函数被触发了");
    return new Promise<void>((resolve, reject) => {
      const connectHeaders = { playerName };
      try {
        initializeWebSocketConnection(connectHeaders, () => {
          // console.log(`Connected as ${playerName}`);
          resolve();
        });
      } catch (error) {
        console.error('Connection Error:', error);
        reject(error);
      }
    });
  };

  const disconnect = () => {
    console.log("ohhh, 我断开连接了");
    
    stompClient?.disconnect(() => {
      console.log('Disconnected');
    });
  };

  const publish = (destination: string, body: any) => {
    console.log("socketGameService的publish函数被触发了");
    if (stompClient?.connected) {
      stompClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('Cannot publish, not connected');
    }
  };

  const subscribe = (destination: string, callback: messageCallbackType): StompSubscription | null => {
    console.log("socketGameService的subscribe函数被触发了");
    if (stompClient?.connected) {
      return stompClient.subscribe(destination, callback);
    } else {
      console.error('Cannot subscribe, not connected');
      return null;
    }
  };

  const subscribeUser = (destination: string, callback: messageCallbackType): StompSubscription | null => {
    if (stompClient?.connected) {
      return stompClient.subscribe(destination, callback);
    } else {
      console.error('Cannot subscribe, not connected');
      return null;
    }
  };

  const unsubscribe = (destination: string) => {
    if (stompClient?.connected) {
      stompClient.unsubscribe(destination);
    } else {
      console.error('Cannot unsubscribe, not connected');
    }
  };

  const unsubscribeUser = (destination: string) => {
    if (stompClient?.connected) {
      stompClient.unsubscribe(destination);
    } else {
      console.error('Cannot unsubscribe, not connected');
    }
  };

  const getUsername = (): string | undefined => {
    return stompClient?.connectHeaders?.playerName;
  };

  return {
    connect,
    disconnect,
    publish,
    subscribe,
    subscribeUser,
    unsubscribe,
    unsubscribeUser,
    getUsername,
    socketGameDataSubject,
  };
}
