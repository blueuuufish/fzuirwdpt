<template>
  <div class="game-board">
    <pixi-board ref="pixiBoard" id="pixiBoard"></pixi-board>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {useRoomStore} from '@/api/room/roomStore';
import { useSocketStore} from '@/api/ws/socketStore';
import { SocketEventType } from '@/shared/enums/socketEventTypeEnum';
import { eventBus } from '@/api/common/eventBus';
// import PixiBoard from './PixiBoard.vue'
/* import PixiBoardComponent from './PixiBoardComponent.vue'; */
const pixiBoard = ref();
const roomService = useRoomStore();
const socketGameService = useSocketStore();
let subscriptions = [];

const init = (room) => {
  //TODO: 调用pixiBoard的方法，需要pixiBoard导出 defineExpose
  console.log(pixiBoard)
  pixiBoard.value.init(room.puzzle);
};

const roomEvent = (message) => {
  if (message.event === SocketEventType.Room_Puzzle_Move) {
    const body = message.body;
    puzzleMoveEvent(body);
  } else if (message.event === SocketEventType.Room_Puzzle_Release) {
    const body = message.body;
    puzzleReleaseEvent(body);
  } else if (message.event === SocketEventType.Room_UserLeft) {
    const body = message.body;
    //TODO: 需要调用子组件的方法
    pixiBoard.value.removeInteractionFromPieces(body.user);
  }
};

const puzzleMoveEvent = (roomPuzzleMove) => {
  if (roomPuzzleMove.username === socketGameService.getUsername()) return;

  const user = roomService.getUserByUsername(roomPuzzleMove.username);
  if (!user) return;

   //TODO: 需要调用子组件的方法
  pixiBoard.value.movePiece(user, roomPuzzleMove.puzzlePiece);
};

const puzzleReleaseEvent = (roomPuzzleRelease) => {
   //TODO: 需要调用子组件的方法
  pixiBoard.value.releasePiece(roomPuzzleRelease.puzzlePiece, roomPuzzleRelease.changedPieces);
};

const dragPiece = (idX, idY, position) => {
  roomService.sendMovePuzzlePiece({ idX, idY, position, group: 0 });
};

const releasePiece = (idX, idY, position) => {
  roomService.sendReleasePuzzlePiece({ idX, idY, position, group: 0 });
};

const zoom = (strength) => {
   //TODO: 需要调用子组件的方法
  pixiBoard.value.zoom(strength);
};

onMounted(() => {
  subscriptions.push(
    roomService.roomSubject.subscribe((room) => {
      if (room.id) {
        init(room);
        subscriptions[0].unsubscribe();
      }
    }),
    //TODO: 取emit事件，能否这样用？
    // roomService.on("roomEvent",(message) => roomEvent(message))
    eventBus.on('roomEvent',roomEvent)
  );
  if (roomService.roomSubject.value.id) {
    // console.log(roomService.roomSubject.value)
    console.log(pixiBoard)
    init(roomService.roomSubject.value);
  }
});

onUnmounted(() => {
  subscriptions.forEach((sub) => sub.unsubscribe());
  subscriptions = [];
});
defineExpose({zoom,});

</script>
<style lang="css" >
.game-board {
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
