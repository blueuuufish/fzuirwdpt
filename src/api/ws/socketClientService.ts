import SockJS from 'sockjs-client';
import { Stomp, CompatClient, StompSubscription, messageCallbackType} from '@stomp/stompjs';
import { environment } from '@/environments/environment';

export function useSocketClient() {
  let stompClient:CompatClient;

  const initializeWebSocketConnection = (connectHeaders:any, connectCallback: Function) => {
    const ws = new SockJS(environment.wsApiUrl); // 替换为你的实际 WebSocket 端点
    stompClient = Stomp.over(()=> ws);
    stompClient.onConnect = (frame:any)=>{
        onConnect;
        connectCallback(frame)
    };
    stompClient.onWebSocketClose = onError;
    stompClient.onDisconnect = onError;
    stompClient.onStompError = onError;
    stompClient.connectHeaders = connectHeaders;
    stompClient.activate();
  };
  const onConnect = (frame: any) => {
    console.log("CONNECTED");
  }

  const onError= (frame: any )=> {
    console.log("ERROR");
    console.log(frame);
  }

  const disconnectWebSocketConnection = () => {
      stompClient.disconnect();
  };

  const publish = (destination:string, body:any) => {
      stompClient.publish({
        destination:destination,
        body:JSON.stringify(body)
      });
  };

  const subscribe = (destination:string, callback: messageCallbackType): StompSubscription => {
      return stompClient.subscribe(destination, callback);
  };

  const unsubscribe = (destination: string) => {
    stompClient.unsubscribe(destination);
  };

  return {
    initializeWebSocketConnection,
    disconnectWebSocketConnection,
    publish,
    subscribe,
    unsubscribe,
  };
}
