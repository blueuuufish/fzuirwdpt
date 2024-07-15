<template>
    <div class="align-center"
       ref="pixiContainer"
       id="pixiContainer"></div>

</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  defineComponent,
  getCurrentInstance,
  inject,
  ComponentInstance,
  onUnmounted
} from 'vue'
import { Application, Assets, Container, Sprite, Texture } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
// import PuzzlePieceSprite from './PuzzlePieceSprite.vue';
import {PuzzlePieceSprite} from './PuzzlePieceSprite'
import { PuzzlePiece } from '@/shared/models/puzzlePieceModel'
import { Puzzle } from '@/shared/models/puzzleModel'
import { RoomUser } from '@/shared/models/roomUserModel'
import {useRoomStore} from '@/api/room/roomStore';
import { before, create } from 'lodash-es'
import PixiBoard from './PixiBoard.vue';
import {RankDto} from '@/shared/models/dto/rankDto';
import {useTimerStore} from '@/store/timeStore'
import request from '@/utils/request'
import { from } from 'rxjs'
import { environment } from '@/environments/environment'
const pixiContainer = ref<HTMLElement | null>(null);
// let pixiApp
// let pixiViewport
// let puzzleTexture
// let puzzlePieces = []
// let pieceMap = new Map()
// let puzzle
// let activePuzzlePiece = null
let pieceLen:number;
let pixiApp: Application;
let pixiViewport: Viewport;
let worldWidth = 2000
let worldHeight = 1500
let puzzleTexture: Texture;
const pieceContainer = new Container()
let puzzlePieces: PuzzlePieceSprite[][] = [];
let pieceMap: Map<number, PuzzlePieceSprite[]> = new Map();
let puzzle: Puzzle;
let activePuzzlePiece: PuzzlePieceSprite | null = null;

// const pixiBoard = ref();
const initPixi = () => {
  const {proxy} = getCurrentInstance() 

  pixiApp = new Application({
    antialias: true,
    backgroundAlpha: 0,
    resolution: 1,
    resizeTo: window
  })
  pixiViewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: worldWidth,
    worldHeight: worldHeight,
    events: pixiApp.renderer.events,
  })

  pixiApp.stage.addChild(pixiViewport)
  pixiViewport.drag().pinch().wheel().decelerate()

  pieceContainer.sortableChildren = true
  pieceContainer.eventMode = 'static'
  pieceContainer.on('globalpointermove', (e) => onDragMove(e))
};
initPixi()
const roomService = useRoomStore();
const dragPieceToWS = (idX: number, idY: number, position: number[]) => {
  roomService.sendMovePuzzlePiece({ idX, idY, position, group: 0 });
};
const releasePieceToWS = (idX: number, idY: number, position: number[]) => {
  
  roomService.sendReleasePuzzlePiece({ idX, idY, position, group: 0 });
  // setTimeout(()=>{
  //   roomService.sendReleasePuzzlePiece({ idX, idY, position, group: 0 });
  // },100)

  // }
};
const resizeWindow = () => {
      if (pixiApp && pixiContainer.value) {
        pixiViewport.screenWidth = window.innerWidth;
        pixiViewport.screenHeight = window.innerHeight;
        // pixiApp.renderer.resize(pixiContainer.value.clientWidth, pixiContainer.value.clientHeight);
   
      }
    };

onMounted(() => {
  // initPixi()
  //Property 'value' may not exist on type 'number'. Did you mean 'valueOf'?
  if (pixiContainer.value) {
    pixiContainer.value.appendChild(pixiApp.view)
  }
  window.addEventListener('resize', resizeWindow);
  resizeWindow();
  // window.addEventListener('resize', resizeWindow);
})
onUnmounted(()=>{
  window.removeEventListener('resize', resizeWindow);

})
const onDragMove = (event:any) => {
      // console.log('dragmove');
      if (activePuzzlePiece != null) {
        activePuzzlePiece.onDragMove(event);
      }
    };
const setWorldSize = (_worldWidth: number, _worldHeight: number) => {
  // pixiViewport.resize(worldWidth, worldHeight);

  worldWidth = _worldWidth;
  worldHeight = _worldHeight


  pixiViewport.worldWidth = _worldWidth;
  pixiViewport.worldHeight = _worldHeight;
  pixiViewport.clamp({ direction: 'all' });
  pixiViewport.clampZoom({
    minWidth: pixiViewport.screenWidth / 3,
    minHeight: pixiViewport.screenHeight / 3,
    maxWidth: pixiViewport.worldWidth,
    maxHeight: pixiViewport.worldHeight,
  });
  pixiViewport.setZoom(0.01, true);
};

const init = (puzzleData: Puzzle,pixiBoard:ComponentInstance<typeof PixiBoard>) => {
  reset();

  puzzle = puzzleData;
  setWorldSize(puzzleData.worldSize[0], puzzleData.worldSize[1]);
 //Texture.fromURL(puzzleData.imageBase64)

  Assets.load(puzzleData.imageBase64).then((texture: Texture) => {
    // puzzleTexture = texture;
    const bgOffsetX = puzzleData.pieceSize[0] * PuzzlePieceSprite.SHAPE_OFFSET;
    const bgOffsetY = puzzleData.pieceSize[1] * PuzzlePieceSprite.SHAPE_OFFSET;
    const bgSprite = new Sprite(texture);
    // const bgSprite1 = new Sprite(texture);

    bgSprite.width = puzzleData.imageSize[0];
    bgSprite.height = puzzleData.imageSize[1];
    bgSprite.alpha = 0.5;
    bgSprite.position.set(worldWidth / 2 - bgSprite.width / 2 - bgOffsetX, worldHeight / 2 - bgSprite.height / 2 - bgOffsetY);
    // bgSprite.position.set(1458.5 , 582.75);
    

    
    pixiViewport.addChild(bgSprite);

    
    pixiViewport.addChild(pieceContainer);
    pixiViewport.moveCenter(bgSprite.position.x + bgSprite.width / 2, bgSprite.position.y + bgSprite.height / 2);

    
    puzzleTexture = texture;
    createPieces(puzzleData.pieceSize, puzzleData.piecesDimensions, puzzleData.puzzlePieces,pixiBoard);
    pixiApp.resize();
    pieceLen = pieceMap.size;

    // pixiApp.resizeTo  = window;
  });
};
const reset = () => {
  pieceMap.clear();
  puzzlePieces = [];
  pixiViewport.removeChildren();
  pieceContainer.removeChildren();
};
// const {proxy} = getCurrentInstance() 
const createPieces =  (pieceSize: number[], piecesDimensions: number[], pieces: PuzzlePiece[],pixiBoard:ComponentInstance<typeof PixiBoard>) => {
  const scaleX = puzzle.imageSize[0] / puzzleTexture.width;
  const scaleY = puzzle.imageSize[1] / puzzleTexture.height;

  const pieceWidth = pieceSize[0];
  const pieceHeight = pieceSize[1];
  const piecesX = piecesDimensions[0];
  const piecesY = piecesDimensions[1];

  puzzlePieces = new Array(piecesX).fill(undefined).map(() => new Array(piecesY).fill(undefined));

 
  // const refsCon = proxy.$refs.pixiContainer
  
  
  for (let i = 0; i < piecesY; i++) {
    for (let j = 0; j < piecesX; j++) {
      const piece = pieces[i * piecesX + j];
      const pieceSprite = new PuzzlePieceSprite(pixiBoard, puzzleTexture, pieceWidth, pieceHeight, j, i, scaleX, scaleY, piecesDimensions);
      pieceSprite.setPosition(piece.position[0], piece.position[1]);
      setGroup(pieceSprite, piece.group);

      if (piece.group === -9999) {
        pieceSprite.setCompleted(true);
      }

      puzzlePieces[j][i] = pieceSprite;
      pieceContainer.addChild(pieceSprite);
    }
  }
};
const setGroup = (pieceSprite: PuzzlePieceSprite, group: number) => {
  if (pieceSprite.group !== group && pieceMap.has(pieceSprite.group)) {
    pieceMap.set(pieceSprite.group, pieceMap.get(pieceSprite.group)!.filter((ps) => ps !== pieceSprite));
  }

  pieceSprite.setGroup(group);

  if (pieceMap.has(group)) {
    if(!pieceMap.get(group)?.includes(pieceSprite)){
      pieceMap.set(group, [...(pieceMap.get(group) ?? []), pieceSprite]);
    }
  } else {
    pieceMap.set(group, [pieceSprite]);
  }

};
const dragPieceSprite = (pieceSprite: PuzzlePieceSprite) => {
    dragPieceToWS(pieceSprite.idX, pieceSprite.idY, [pieceSprite.position.x, pieceSprite.position.y]);
    stopPanning();

    movePieceGroup(pieceSprite);
};

const releasePieceSprite = (pieceSprite: PuzzlePieceSprite) => {
    releasePieceToWS(pieceSprite.idX, pieceSprite.idY, [pieceSprite.position.x, pieceSprite.position.y]);
    startPanning();
};
const movePiece = (user: RoomUser, piece: PuzzlePiece) => {

  if(puzzlePieces.length!==0){
    const pieceSprite: PuzzlePieceSprite = puzzlePieces[piece.idX][piece.idY];

    pieceSprite.setPosition(piece.position[0], piece.position[1]);
    pieceSprite.setInteractedUser(user);

    movePieceGroup(pieceSprite);

  }

    // const pieceSprite: PuzzlePieceSprite = puzzlePieces[piece.idX][piece.idY];

    // pieceSprite.setPosition(piece.position[0], piece.position[1]);
    // pieceSprite.setInteractedUser(user);

    // movePieceGroup(pieceSprite);
};
const getRealX = (idX: number): number => {
    return puzzle.worldSize[0]/2.- puzzle.imageSize[0]/2.-puzzle.pieceSize[0]/4.+idX*puzzle.pieceSize[0];
}

const getRealY = (idY: number): number => {
    return puzzle.worldSize[1]/2.- puzzle.imageSize[1]/2.-puzzle.pieceSize[1]/4.+idY*puzzle.pieceSize[1];
}
const movePieceGroup = (keyPieceSprite: PuzzlePieceSprite) => {
    if(pieceMap.has(keyPieceSprite.group)){
      for(let ps of pieceMap.get(keyPieceSprite.group)!) {

        if(ps !== keyPieceSprite){
          const newX = keyPieceSprite.x + getRealX(ps.idX) - getRealX(keyPieceSprite.idX);
          const newY = keyPieceSprite.y + getRealY(ps.idY) - getRealY(keyPieceSprite.idY);

          ps.setPosition(newX, newY);
        }
      }
    }
  };
  const releasePiece = (piece: PuzzlePiece, changedPieces: PuzzlePiece[] = []) => {
    const pieceSprite: PuzzlePieceSprite = puzzlePieces[piece.idX][piece.idY];

    setGroup(pieceSprite, piece.group);
    pieceSprite.setPosition(piece.position[0], piece.position[1]);

    
    pieceSprite.setInteractedUser(null);
    let piecesLen = puzzle.piecesDimensions[0]*puzzle.piecesDimensions[1];
    if(piece.group === -9999) {
      pieceSprite.setCompleted(true);
      if(pieceMap.get(-9999)?.length === piecesLen){
        // setTimeout(()=>{
          // alert('成功啦，hhhhh')
        // },100)
        const timeStore = useTimerStore();
        const startTime = timeStore.getStartTime();
        const endTime = new Date().getTime();
        if(startTime){
          const totalTime = (endTime - startTime) / 1000;
          const formData:FormData = new FormData();
          formData.append('id',roomService.roomSubject.value.id)
          formData.append('score',`${totalTime}`);
          // const formData = {id: roomService.roomSubject.value.id,score: totalTime}
          request.post({
            url:`${environment.apiUrl}/leaderboard/addScore`,
            data:formData,
            headersType:'application/json'
          }).then((data)=>{
            alert(`成功啦，总时长：${totalTime.toFixed(0)}秒`)
          })
        }    
      }
    }

    for(let i = 0; i < changedPieces.length; i++) {
      const p = changedPieces[i];
      const pSprite = puzzlePieces[p.idX][p.idY];
      setGroup(pSprite, piece.group);

      if(piece.group === -9999) {
        pSprite.setCompleted(true);
      }
    }
    movePieceGroup(pieceSprite);
  };

  const removeInteractionFromPieces = (user: RoomUser) => {
    for(let i = 0; i < puzzlePieces.length; i++) {
      for(let j = 0; j < puzzlePieces[0].length; j++) {
        const pieceSprite = puzzlePieces[i][j];
        if(pieceSprite.getInteractedUser()?.username == user.username){
          pieceSprite.setInteractedUser(null);
        }
      }
    }
  };
  const stopPanning = ():void =>{
    pixiViewport.plugins.pause('drag');
  }
  const startPanning = ():void => {
    pixiViewport.plugins.resume('drag');
  }
  const zoom = (strength: number) => {
    pixiViewport.zoom(strength, true);
  }
  const setActivePuzzlePiece = (piece: PuzzlePieceSprite | null) => {
    activePuzzlePiece = piece;
  }
  const getPuzzlePiece = (x: number, y: number) => {
    if(x < 0 || y < 0 || x >= puzzlePieces.length || y >= puzzlePieces[0].length)
      return null;
    return puzzlePieces[x][y];
  }
  defineExpose({
    removeInteractionFromPieces,
    init,
    releasePiece,
    getPuzzlePiece,
    releasePieceSprite,
    setActivePuzzlePiece,
    dragPieceSprite,
    movePiece,
    zoom
  });
</script>

<style scoped>
#pixiBoard {
  display: flex;
  width: 100%;
  height: 100%;
}
#pixiContainer {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
