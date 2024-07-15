<template>
  <div>
    <join-lobby v-if="socketGameData === null"></join-lobby>
    <lobby v-else></lobby>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, getCurrentInstance } from 'vue';
import JoinLobby from '@/views/lobby/join-lobby/JoinLoby.vue';
import Lobby from '@/views/lobby/lobby/Lobby.vue';
import { SocketGameData } from '@/shared/models/ws/SocketGameDataModel';
import { useSocketStore } from '@/api/ws/socketStore';
import { Subscription } from 'rxjs';
import {useLobbyStore} from '@/api/lobby/lobbyStore'
// import {useRoomStore} from '@/api/room/roomStore'

// import {PuzzlePieceSprite} from '../../game-board/PuzzelePieceSprite'

const socketGameData = ref<SocketGameData|null>(null); // 根据你的逻辑初始化这个数据
let subscriptions: Subscription[]= [];
const socketStore = useSocketStore();
socketStore.initializeClient();
const lobbyService = useLobbyStore();
lobbyService.initializeClient();
// const roomService = useRoomStore();
// roomService.initializeClient();
onMounted(()=>{
  // const new PuzzlePieceSprite()
  subscriptions.push(
    socketStore.socketGameDataSubject.subscribe((data: SocketGameData | null) => {
      socketGameData.value = data;
    })
  )
//   const { proxy, ctx } = getCurrentInstance()
//       const _this = ctx
})
onUnmounted(()=>{
  lobbyService.detach();
  for(let sub of subscriptions) {
      sub.unsubscribe();
    }
    subscriptions = []
})


</script>

<style scoped>
/* Add your styles here */
</style>
