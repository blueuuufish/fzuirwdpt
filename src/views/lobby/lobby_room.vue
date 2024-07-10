<template>
  <v-card>
    <v-card-title>#{{ room.id }}</v-card-title>
    <v-card-text>
      <div class="player-number-panel">
        <v-icon>mdi-account</v-icon>
        <span>{{ room.users.length }}/{{ room.userCapacity }}</span>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="clickOnJoinBtn">Join</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useLobbyService } from '@/api/lobby/lobbyService'; // 假设你有实现该服务
import { Room } from '@/shared/models/roomModel'
import { useRoomService } from '@/api/room/roomService'; // 导入 RoomService
export default {
  name: 'LobbyRoomBlock',
  props: {
    room: {
      type: Room,
      required: true
    }
  },
  setup(props) {
    // const router = useRouter();
    const lobbyService = useLobbyService();
    const roomService = useRoomService();

    const clickOnJoinBtn = () => {
      lobbyService.joinRoom(props.room.id).then(() => {
        roomService.join(props.room.id);
        // router.push(`/room/${props.room.id}`);
      });
    };

    return {
      clickOnJoinBtn,
    };
  },
};
</script>

<style scoped>
.player-number-panel {
  display: flex;
  align-items: center;
}

.v-card {
  margin: 10px;
}
</style>
