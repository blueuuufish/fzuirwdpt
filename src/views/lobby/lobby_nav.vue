<template>
  <v-toolbar class="navbar">
    <v-btn @click="clickOnBackBtn"> Back </v-btn>
    <span class="spacer"></span>
    <div id="username-panel">
      {{ socketGameData?.username }}
    </div>
    <v-btn @click="clickOnCreateRoomBtn"> Create Room </v-btn>
  </v-toolbar>
  <el-button @click="handleButtonClick">Default</el-button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useSocketStore } from "@/api/ws/socketStore";
import { IMessage, StompSubscription } from "@stomp/stompjs";
import { SocketDestinations } from "@/shared/enums/socketDestinationsEnum";
import { SocketEventType } from "@/shared/enums/socketEventTypeEnum";
import { defineEmits } from "vue";

const emit = defineEmits(["roomEvent"]);
const socketGameData = ref(null);
const creatingRoom = ref(false);
const subscriptions = [];
const router = useRouter();
const socketStore = useSocketStore();
const stompSubscription = (ref < StompSubscription) | (null > null);

onMounted(async () => {});

onBeforeUnmount(() => {
  subscriptions.forEach((sub) => sub.unsubscribe());
  if (stompSubscription.value) {
    stompSubscription.value.unsubscribe();
  }
});

const clickOnBackBtn = () => {
  // if (!creatingRoom.value) {
  //   socketStore.disconnectClient();
  // }
  // router.push('/');
};

const clickOnCreateRoomBtn = () => {
  creatingRoom.value = true;
  // Here you can add the logic to navigate to the create room page
  // router.push('/create_room');
};

const handleButtonClick = async () => {
  const roomId = "someRoomId"; // Replace 'someRoomId' with the actual room ID
  try {
    const subscription = socketStore.subscribe('/topic/all', (message) => {
      console.log('Message received.');
      const socketMessage = JSON.parse(message.body);
      console.log('我接受了消息：' + socketMessage.message);
    });
    console.log(subscription);
  } catch (error) {
    console.error("Failed to connect or subscribe:", error);
  }
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
