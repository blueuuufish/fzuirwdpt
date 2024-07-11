<template lang="">
  <AppRoom/>
</template>
<script setup>
import { onUnmounted } from 'vue'
import AppRoom from '../room/AppRoom.vue'
import {useRoomStore} from '@/api/room/roomStore'
const roomService = useRoomStore();
onUnmounted(()=>{
  if(roomService.isJoined()){
      roomService.detach();
    }

})
</script>
<style lang="">
  /* :host {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

#gameBoard {
  display: block;
  width: 100%;
  height: 100%;
} */
</style>