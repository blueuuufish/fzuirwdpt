<template>
  <div></div>
</template>
<template>
    <PixiBoard ref="pixiBoard" />
</template>

<script lang="ts">
import PixiBoard from './PixiBoard.vue';
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import {Room} from '@/shared/models/roomModel'
import { Subscription } from 'rxjs';
import {SocketMessage} from '@/shared/models/ws/socketMessageModel'
import { SocketEventType } from '@/shared/enums/socketEventTypeEnum'
// TODO: api
import { useRoomService } from '@/api/room/roomService'; //api
import { useSocketGameService } from '@/api/ws/socketGameService';//api
import { RoomPuzzleMoveDto } from '@/shared/models/dto/roomPuzzleMoveDto';
import { RoomPuzzleReleaseDto } from '@/shared/models/dto/roomPuzzleReleaseDto';
import { RoomUser } from '@/shared/models/roomUserModel';
import { RoomUserLeftDto } from '@/shared/models/dto/roomUserLeftDto'


// TODO: 检查逻辑是否一致
export default defineComponent({
  components: { PixiBoard },
  setup() {
    const pixiBoard = ref<InstanceType<typeof PixiBoard> | null>(null);
    const subscriptions: Subscription[] = [];
    const roomService = useRoomService();
    const socketGameService = useSocketGameService();

    const init = (room: Room) => {
      pixiBoard.value?.init(room.puzzle);
    };

    const handleRoomEvent = (message: SocketMessage) => {
      if (message.event === SocketEventType.Room_Puzzle_Move) {
        const body = message.body as RoomPuzzleMoveDto;
        puzzleMoveEvent(body);
      } else if (message.event === SocketEventType.Room_Puzzle_Release) {
        const body = message.body as RoomPuzzleReleaseDto;
        puzzleReleaseEvent(body);
      } else if (message.event === SocketEventType.Room_UserLeft) {
        const body = message.body as RoomUserLeftDto;
        pixiBoard.value?.removeInteractionFromPieces(body.user);
      }
    };

    const puzzleMoveEvent = (roomPuzzleMove: RoomPuzzleMoveDto) => {
      if (roomPuzzleMove.username === socketGameService.getUsername()) return;
      const user = roomService.getUserByUsername(roomPuzzleMove.username);
      if (!user) return;
      pixiBoard.value?.movePiece(user, roomPuzzleMove.puzzlePiece);
    };

    const puzzleReleaseEvent = (roomPuzzleRelease: RoomPuzzleReleaseDto) => {
      pixiBoard.value?.releasePiece(roomPuzzleRelease.puzzlePiece, roomPuzzleRelease.changedPieces);
    };

    onMounted(() => {
      subscriptions.push(
        roomService.roomSubject.subscribe((room) => {
          if (room.id) {
            init(room);
            subscriptions[0].unsubscribe();
          }
        }),
        roomService.roomEvent.subscribe(handleRoomEvent)
      );
      if (roomService.roomSubject.value.id) {
        init(roomService.roomSubject.value);
      }
    });

    onBeforeUnmount(() => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    });

    return {
      pixiBoard,
      dragPiece(idX: number, idY: number, position: number[]) {
        roomService.sendMovePuzzlePiece({ idX, idY, position, group: 0 });
      },
      releasePiece(idX: number, idY: number, position: number[]) {
        roomService.sendReleasePuzzlePiece({ idX, idY, position, group: 0 });
      },
      zoom(strength: number) {
        pixiBoard.value?.zoom(strength);
      },
    };
  },
});
</script>
</script>

<style scoped>
/* Add your styles here */
:host {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

#pixiBoard {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
