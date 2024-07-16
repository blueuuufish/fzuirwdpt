<template>
  <uni-card class="box-card">
    <template #header>
      <div class="clearfix">#{{ room.id }}</div>
    </template>
    <div>
      <div class="player-number-panel">
        <uni-icons><i class="el-icon-user-solid"></i></uni-icons>
        <span>{{ room.users.length }}/{{ room.userCapacity }}</span>
      </div>
    </div>
    <div class="card-actions">
      <uni-button type="primary" @click="clickOnJoinBtn">Join</uni-button>
    </div>
  </uni-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { useRoomStore} from '@/api/room/roomStore';
import { Room } from '@/shared/models/roomModel';

const props = defineProps<{room:Room}>();

const roomService = useRoomStore();

const clickOnJoinBtn = () => {
  roomService.join(props.room.id);
};
</script>

<style scoped>
.el-card {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 300px;
}

.el-card-header {
  padding: 0;
}

.player-number-panel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.player-number-panel span {
  padding-left: 3px;
}
</style>
