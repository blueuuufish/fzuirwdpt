<template>
  <div id="pixiBoard">
    <pixi-board ref="pixiBoard" ></pixi-board>
  </div>
</template>
<script setup lang='ts'>
import { ref, onMounted, onUnmounted, provide ,ComponentInstance} from 'vue';
import {useRoomStore} from '@/api/room/roomStore';
import { useSocketStore} from '@/api/ws/socketStore';
import { SocketEventType } from '@/shared/enums/socketEventTypeEnum';
import { eventBus } from '@/api/common/eventBus';
import PixiBoard from './PixiBoard.vue'
import { Subscription } from 'rxjs';
import { Room } from '@/shared/models/roomModel';
import { SocketMessage } from '@/shared/models/ws/socketMessageModel';
import { RoomPuzzleMoveDto } from '@/shared/models/dto/roomPuzzleMoveDto';
import { RoomPuzzleReleaseDto } from '@/shared/models/dto/roomPuzzleReleaseDto';
/* import PixiBoardComponent from './PixiBoardComponent.vue'; */
const pixiBoard = ref();
const roomService = useRoomStore();
const socketGameService = useSocketStore();
let subscriptions:Subscription[] = [];

const init = (room:Room,pixiBoard:ComponentInstance<typeof PixiBoard>) => {
  pixiBoard.value.init(room.puzzle,pixiBoard.value);
};

const handleRoomEvent = (message:SocketMessage) => {
  if (message.event === SocketEventType.Room_Puzzle_Move) {
    const body = message.body;
    puzzleMoveEvent(body);
  } else if (message.event === SocketEventType.Room_Puzzle_Release) {
    const body = message.body;
    puzzleReleaseEvent(body);
  } else if (message.event === SocketEventType.Room_UserLeft) {
    const body = message.body;

    pixiBoard.value.removeInteractionFromPieces(body.user);
  }
};

const puzzleMoveEvent = (roomPuzzleMove:RoomPuzzleMoveDto) => {
  if (roomPuzzleMove.username === socketGameService.getUsername()) return;

  const user = roomService.getUserByUsername(roomPuzzleMove.username);
  if (!user) return;


  pixiBoard.value.movePiece(user, roomPuzzleMove.puzzlePiece);
};

const puzzleReleaseEvent = (roomPuzzleRelease:RoomPuzzleReleaseDto) => {

  pixiBoard.value.releasePiece(roomPuzzleRelease.puzzlePiece, roomPuzzleRelease.changedPieces);
};

const dragPiece = (idX: number, idY: number, position: number[]) => {
  roomService.sendMovePuzzlePiece({ idX, idY, position, group: 0 });
};

const releasePiece = (idX: number, idY: number, position: number[]) => {
  roomService.sendReleasePuzzlePiece({ idX, idY, position, group: 0 });
};

const zoom = (strength:number) => {

  pixiBoard.value.zoom(strength);
};

onMounted(() => {



  subscriptions.push(
    roomService.roomSubject.subscribe(room => {
      if (room.id) {
        init(room,pixiBoard);
        // if(subscriptions[0]!==undefined){
          
        //   subscriptions[0].unsubscribe();
        //   console.log('取消订阅',subscriptions)
        // }
      }
    }),
    roomService.messageSubject.subscribe(message =>{
      handleRoomEvent(message)
    })
    );
    subscriptions[0].unsubscribe();

  // if (roomService.roomSubject.value.id) {

    // init(roomService.roomSubject.value,pixiBoard);
  // }
});

onUnmounted(() => {
  subscriptions.forEach((sub) => sub.unsubscribe());
  subscriptions = [];
});
defineExpose({zoom,});
const gameBoardKey = Symbol('gameBoard')
provide(gameBoardKey,{pixiBoard})

</script>
<style scoped>
.game-board {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

#pixiBoard {
  width: 100%;
  height: 100%;
  margin: 100px;
  padding: 0;
}
</style>
