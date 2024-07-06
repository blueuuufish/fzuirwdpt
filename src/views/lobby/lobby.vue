<template>
  <LobbyNav />
  <div class="container">
    <CreateRoom v-if="creatingRoom" />
    <template v-else>
      <v-row>
        <v-col v-for="room in rooms" :key="room.id" cols="12">
          <LobbyRoomBlock :room="room" class="py-2" />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoomService } from '@/api/room/roomService';
import { useLobbyService } from '@/api/lobby/lobbyService';
// import LobbyNav from '@/views/lobby/lobby_nav.vue';
// import CreateRoom from '@/views/lobby/create_room.vue';
import LobbyRoomBlock from '@/views/lobby/lobby_room.vue';
import { Room } from '@/shared/models/roomModel';
import {SocketMessage} from "@/shared/models/ws/socketMessageModel";

export default defineComponent({
  components: {
    // LobbyNav,
    // CreateRoom,
    LobbyRoomBlock
  },
  setup() {
    const creatingRoom = ref(false);
    const rooms = ref<Room[]>([]);
    const subscriptions = ref<any[]>([]); // 管理订阅

    const roomService = useRoomService();
    const lobbyService = useLobbyService();

    const loadInitialData = (initialData: any) => {
      // rooms.value = of(initialData.rooms);
    };

    const lobbyEvent = (message: any) => {
      if (message.event === 'UserLobby_FailedToJoinToRoom') {
        console.log("Failed to join");
        // TODO: ROOM FAILED TO JOIN EVENT
      }
    };

    onMounted(() => {
      // lobbyService.join((message: any) => loadInitialData(message));

      subscriptions.value.push(
          lobbyService.creatingRoomSubject.subscribe((creatingRoom2: boolean) => {
            creatingRoom.value = creatingRoom2;
          }),
          // lobbyService.$emit("lobbyEvent").subscribe((message: any) => lobbyEvent(message)),
          // lobbyEvent(lobbyService.$emit("lobbyEvent").message),
          // lobbyService.$emit("lobbyEvent").subscribe((message:SocketMessage) => {
          //   lobbyEvent(message);
          // }),
          lobbyService.roomListSubject.subscribe((roomList: Room[]) => {
            rooms.value = roomList;
          })
      );

      rooms.value = lobbyService.roomListSubject.value;
    });

    onBeforeUnmount(() => {
      subscriptions.value.forEach((sub: any) => sub.unsubscribe());
      subscriptions.value = [];
    });

    const clickOnCreateRoomBtn = () => {
      creatingRoom.value = true;
    };

    const changeCreatingRoom = (creating: boolean) => {
      creatingRoom.value = creating;
    };

    return {
      creatingRoom,
      rooms,
      clickOnCreateRoomBtn,
      changeCreatingRoom
    };
  }
});
</script>

<style scoped>

</style>
