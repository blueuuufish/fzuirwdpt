import { defineStore } from 'pinia';
import { useSocketGameService, SocketGameService } from '@/api/ws/socketGameService';
import { StompSubscription, messageCallbackType } from '@stomp/stompjs';

interface SocketState {
  client: SocketGameService | null;
}

export const useSocketStore = defineStore('socket', {
  state: (): SocketState => ({
    client: null,
  }),
  actions: {
    initializeClient() {
      if (!this.client) {
        this.client = useSocketGameService();
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
        const subscription = this.client.subscribe(destination, callback);
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
        this.client.unsubscribe(destination);
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
    sendCommand(destination: string, command: any) {
      if (this.client) {
        this.client.publish(destination, command);
      } else {
        console.error('Client not initialized');
      }
    },
  },
});
