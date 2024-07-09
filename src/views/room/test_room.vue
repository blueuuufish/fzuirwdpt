<template>
  <RoomComponent :room="room" />
</template>

<script>
import { defineComponent, ref } from 'vue';
import RoomComponent from './room.vue';

export default defineComponent({
  components: {
    RoomComponent
  },
  setup() {
    const room = ref({
      id: 'room1',
      users: [
        { id: 'user1', username: 'Alice', getColor: () => 'red' },
        { id: 'user2', username: 'Bob', getColor: () => 'blue' }
      ]
    });

    return {
      room
    };
  }
});
</script>

<style scoped>
/* 添加任何测试页面需要的样式 */
</style>
