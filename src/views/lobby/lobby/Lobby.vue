<template>
  <LobbyNav/>
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
<script setup lang='ts'>
import { Room } from '@/shared/models/roomModel';
import { Subscription } from 'rxjs';
import {ref,onMounted, onUnmounted} from 'vue'
import {useLobbyStore} from '@/api/lobby/lobbyStore'
import LobbyNav from './LobbyNav.vue'
import CreateRoom from './CreateRoom.vue'
import LobbyRoomBlock from './LobbyRoomBlock.vue'
import {LobbyInitialDataDto} from '@/shared/models/dto/lobbyInitDataDto'


const creatingRoom = ref(false);
const rooms = ref<Room[]>([]);
let subscriptions: Subscription[]= [];
const lobbyService = useLobbyStore();
const loadInitialData= (initialData: LobbyInitialDataDto) =>{
    // this.rooms = of(initialData.rooms);
  }
onMounted(()=>{
  lobbyService.join((message: any) => loadInitialData(message))
  subscriptions.push(
    lobbyService.creatingRoomSubject.subscribe((flag: boolean) => {
        creatingRoom.value = flag;
      }),
      //TODO: 从子组件来的东西
      // lobbyService.lobbyEvent.subscribe((message: SocketMessage) => this.lobbyEvent(message)),
    lobbyService.roomListSubject.subscribe((roomList: Room[]) => {
        rooms.value = roomList;
        console.log(roomList)
      })
  );
})
onUnmounted(()=>{
  for(let sub of subscriptions) {
      sub.unsubscribe();
    }
    subscriptions = [];

})

</script>
<style lang="">
  
</style>