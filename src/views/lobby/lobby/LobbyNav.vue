<template>
  <v-toolbar class="navbar">
    <uni-button type="info" round @click="clickOnBackBtn">Back</uni-button>

    <span class="spacer"></span>
    <div id="username-panel">
      {{ socketGameData?.username }}
    </div>
    <uni-button type="info" round @click="clickOnCreateRoomBtn">Create Room</uni-button>

  </v-toolbar>
</template>

<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useSocketStore } from "@/api/ws/socketStore";
import { SocketDestinations } from "@/shared/enums/socketDestinationsEnum";
import { SocketEventType } from "@/shared/enums/socketEventTypeEnum";
import { defineEmits } from "vue";
import { SocketGameData } from '@/shared/models/ws/SocketGameDataModel'
import { Subscription } from "rxjs";
import { useLobbyStore } from "@/api/lobby/lobbyStore";

const emit = defineEmits(["roomEvent"]);
const socketGameData = ref<SocketGameData|null>(null);
const creatingRoom = ref(false);
let subscriptions:Subscription[] = [];
const router = useRouter();
const socketStore = useSocketStore();
const lobbyService = useLobbyStore();

onMounted(() => {
  subscriptions.push(
    socketStore.socketGameDataSubject.subscribe((data: SocketGameData | null) => { socketGameData.value = data;}),
    lobbyService.creatingRoomSubject.subscribe((flag: boolean) => {
        creatingRoom.value = flag;
      })  
  );
  socketGameData.value = socketStore.socketGameDataSubject.value;
});

onBeforeUnmount(() => {
  subscriptions.forEach((sub) => sub.unsubscribe());
  subscriptions = []
});

const clickOnBackBtn = () => {
  if(!creatingRoom.value){
    socketStore.disconnectClient();
  }
  router.push('/lobby')
  lobbyService.changeCreatingRoom(false)
};

const clickOnCreateRoomBtn = () => {
  lobbyService.changeCreatingRoom(true)
  // Here you can add the logic to navigate to the create room page
  // router.push('/create_room');
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
