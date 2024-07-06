import { defineStore } from 'pinia';
import { useSocketGameService, SocketGameService } from '@/api/ws/socketGameService';
import { StompSubscription, messageCallbackType } from '@stomp/stompjs';
import { SocketGameData } from '@/shared/models/ws/SocketGameDataModel';
import { BehaviorSubject } from 'rxjs';
interface SocketState {
  client: SocketGameService | null;
  socketGameDataSubject: BehaviorSubject<SocketGameData | null>
}

export const useSocketStore = defineStore('socket', {
  state: (): SocketState => ({
    client: null,
    socketGameDataSubject: new BehaviorSubject<SocketGameData|null>(null)
  }),
  actions: {
    initializeClient() {
      if (!this.client) {
        this.client = useSocketGameService();
        this.socketGameDataSubject = this.client.socketGameDataSubject
      }
    },
    async connectClient(playerName: string): Promise<void> {
      if (this.client) {
        try {
          await this.client.connect(playerName);
        } catch (error) {
          throw new Error(`Connection failed: ${error}`);
        }
      } else {
        throw new Error('Client not initialized');
      }
    },
    subscribe(destination: string, callback: messageCallbackType): StompSubscription | undefined {
      if (this.client) {
        const subscription = this.client.subscribe("/topic"+destination, callback);
        if (subscription) {
          return subscription;
        } else {
          console.error(`Subscription to ${destination} failed`);
        }
      } else {
        console.error('Client not initialized');
      }
    },
    subscribeUser(destination: string, callback: messageCallbackType): StompSubscription | undefined {
      if (this.client) {
        const subscription = this.client.subscribe("/user/topic"+destination, callback);
        if (subscription) {
          return subscription;
        } else {
          console.error(`Subscription to ${destination} failed`);
        }
      } else {
        console.error('Client not initialized');
      }
    },
    unsubscribe(destination: string) {
      if (this.client) {
        this.client.unsubscribe("/topic"+destination);
      } else {
        console.error('Client not initialized');
      }
    },
    unsubscribeUser(destination: string) {
      if (this.client) {
        this.client.unsubscribe("/user/topic"+destination);
      } else {
        console.error('Client not initialized');
      }
    },
    disconnectClient() {
      if (this.client) {
        this.client.disconnect();
      } else {
        console.error('Client not initialized');
      }
    },
    publish(destination: string, body: any) {
      if (this.client) {
        this.client.publish("/app"+destination, body);
      } else {
        console.error('Client not initialized');
      }
    },
  },
});
