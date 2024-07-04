<template>
<!--  <div v-if="!socketGameData">-->
<!--    <JoinLobby />-->
<!--  </div>-->
<!--  <div v-else>-->
<!--    <Lobby />-->
<!--  </div>-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { SocketGameData } from '@/api/ws/models/socket-game-data.model';
import { useLobbyService } from '@/api/lobby/lobbyService';
import { useSocketGameService } from '@/api/ws/socketGameService';
import { Subscription } from 'rxjs';

export default defineComponent({
  name: 'LobbyPage',
  components: {
    // JoinLobby: () => import('@/components/JoinLobby.vue'),
    Lobby: () => import('@/views/lobby/lobby2.vue')
  },
  setup() {
    const socketGameData = ref<SocketGameData | null>(null);
    const subscriptions = ref<Subscription[]>([]);
    const socketGameService = useSocketGameService();
    const lobbyService = useLobbyService();

    onMounted(() => {
      subscriptions.value.push(socketGameService.socketGameDataSubject.subscribe((data: SocketGameData | null) => {
        socketGameData.value = data;
      }));
    });

    onBeforeUnmount(() => {
      lobbyService.detach();
      for (let sub of subscriptions.value) {
        sub.unsubscribe();
      }
      subscriptions.value = [];
    });

    return {
      socketGameData
    };
  }
});
</script>

<style scoped>
:host {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
