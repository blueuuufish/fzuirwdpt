<template>
  <el-card class="box-card">
    <template #header>
      <div class="clearfix">#{{ room.id }}</div>
    </template>
    <div>
      <div class="player-number-panel">
        <el-icon><i class="el-icon-user-solid"></i></el-icon>
        <span>{{ room.users.length }}/{{ room.userCapacity }}</span>
      </div>
    </div>
    <div class="card-actions">
      <el-button type="primary" @click="clickOnJoinBtn">Join</el-button>
    </div>
  </el-card>
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
