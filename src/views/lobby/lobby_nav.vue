<template>
  <v-toolbar class="navbar">
    <v-btn @click="clickOnBackBtn">
      Back
    </v-btn>
    <span class="spacer"></span>
    <div id="username-panel">
      {{ socketGameData?.username }}
    </div>
    <v-btn @click="clickOnCreateRoomBtn">
      Create Room
    </v-btn>
  </v-toolbar>
</template>

<script>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useRouter} from 'vue-router';
import {useLobbyService} from '@/api/lobby/lobbyService'; // 假设你有实现这些服务
import {useSocketGameService} from '@/api/ws/socketGameService'
export default {
  name: 'LobbyNav',
  setup() {
    const socketGameData = ref(null);
    const creatingRoom = ref(false);
    const subscriptions = [];
    const router = useRouter();
    const socketGameService = useSocketGameService();
    const lobbyService = useLobbyService();

    onMounted(() => {
      subscriptions.push(
          socketGameService.socketGameDataSubject.subscribe(data => {
            socketGameData.value = data;
          }),
          lobbyService.creatingRoomSubject.subscribe(creating => {
            creatingRoom.value = creating;
          })
      );

      socketGameData.value = socketGameService.socketGameDataSubject.value;
    });

    onBeforeUnmount(() => {
      subscriptions.forEach(sub => sub.unsubscribe());
    });

    const clickOnBackBtn = () => {
      if (!creatingRoom.value) {
        socketGameService.disconnect();
      }
      router.push('/');
      lobbyService.changeCreatingRoom(false);
    };

    const clickOnCreateRoomBtn = () => {
      lobbyService.changeCreatingRoom(true);
      // router.push('/create_room');
    };

    return {
      socketGameData,
      clickOnBackBtn,
      clickOnCreateRoomBtn,
    };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spacer {
  flex: 1;
}

#username-panel {
  font-weight: bold;
}
</style>
