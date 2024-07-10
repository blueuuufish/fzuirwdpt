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
  ComponentInstance
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
const pixiContainer = ref<HTMLElement | null>(null);
// let pixiApp
// let pixiViewport
// let puzzleTexture
// let puzzlePieces = []
// let pieceMap = new Map()
// let puzzle
// let activePuzzlePiece = null

let pixiApp: Application;
let pixiViewport: Viewport;
const worldWidth = 2000
const worldHeight = 1500
let puzzleTexture: Texture;
const pieceContainer = new Container()
let puzzlePieces: PuzzlePieceSprite[][] = [];
let pieceMap: Map<number, PuzzlePieceSprite[]> = new Map();
let puzzle: Puzzle;
let activePuzzlePiece: PuzzlePieceSprite | null = null;
// const pixiBoard = ref();
const initPixi = () => {
  // const {ctx} = getCurrentInstance();
  // const instance=

  // let {proxy}=instance
  // console.log(instance)
  // const {ctx} = instance;
  // if (instance && instance.proxy.$parent) {
  //   console.log('Parent instance:', instance.proxy.$parent);
  // }
  // 定义一个符号用于依赖注入
  const gameBoardKey = Symbol('gameBoard');

  // 注入父组件实例
  const gameBoard = inject(gameBoardKey)
  // console.log(pixiBoard)
  const {proxy} = getCurrentInstance() 

  pixiApp = new Application({
    antialias: true,
    backgroundAlpha: 0,
    resolution: 1,
    //TODO: hostRef.nativeElement  hostRef: ElementRef 是什么？？
    resizeTo: proxy.$refs.pixiContainer
  })
  console.log(window.innerWidth)
  console.log(window.innerHeight)
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
};
onMounted(() => {
  // initPixi()
  //Property 'value' may not exist on type 'number'. Did you mean 'valueOf'?
  if (pixiContainer.value) {
    console.log('sadasd')
    pixiContainer.value.appendChild(pixiApp.view)
  }

  // console.log(proxy.$refs.pixiContainer)
})
const onDragMove = (event:any) => {
      console.log('dragmove');
      if (activePuzzlePiece != null) {
        activePuzzlePiece.onDragMove(event);
      }
    };
const setWorldSize = (worldWidth: number, worldHeight: number) => {
  pixiViewport.resize(worldWidth, worldHeight);
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
  console.log('323',pixiBoard)

  puzzle = puzzleData;
  setWorldSize(puzzleData.worldSize[0], puzzleData.worldSize[1]);
 //Texture.fromURL(puzzleData.imageBase64)
 console.log(puzzleData.imageBase64)

  Assets.load(puzzleData.imageBase64).then((texture: Texture) => {
    puzzleTexture = texture;
    

    const bgOffsetX = puzzleData.pieceSize[0] * PuzzlePieceSprite.SHAPE_OFFSET;
    const bgOffsetY = puzzleData.pieceSize[1] * PuzzlePieceSprite.SHAPE_OFFSET;
    const bgSprite = new Sprite(texture);
    console.log('7865',texture);
    bgSprite.width = puzzleData.imageSize[0];
    bgSprite.height = puzzleData.imageSize[1];
    bgSprite.alpha = 0.5;
    bgSprite.position.set(worldWidth / 2 - bgSprite.width / 2 - bgOffsetX, worldHeight / 2 - bgSprite.height / 2 - bgOffsetY);
    console.log(bgSprite)
    
    pixiViewport.addChild(bgSprite);
    console.log('2134', pixiViewport);
    console.log('7877', bgSprite);
    
    pixiViewport.addChild(pieceContainer);
    pixiViewport.moveCenter(bgSprite.position.x + bgSprite.width / 2, bgSprite.position.y + bgSprite.height / 2);
    console.log('213', pixiViewport);
    

    createPieces(puzzleData.pieceSize, puzzleData.piecesDimensions, puzzleData.puzzlePieces,pixiBoard);
    pixiApp.resize();
  });
};
const reset = () => {
  pieceMap.clear();
  puzzlePieces = [];
  pixiViewport.removeChildren();
  pieceContainer.removeChildren();
};
// const {proxy} = getCurrentInstance() 
const createPieces = (pieceSize: number[], piecesDimensions: number[], pieces: PuzzlePiece[],pixiBoard:ComponentInstance<typeof PixiBoard>) => {
  console.log('21321', pixiBoard)
  const scaleX = puzzle.imageSize[0] / (puzzleTexture.width ?? 1);
  const scaleY = puzzle.imageSize[1] / (puzzleTexture.height ?? 1);

  const pieceWidth = pieceSize[0];
  const pieceHeight = pieceSize[1];
  const piecesX = piecesDimensions[0];
  const piecesY = piecesDimensions[1];

  puzzlePieces = new Array(piecesX).fill(undefined).map(() => new Array(piecesY).fill(undefined));

 
  // const refsCon = proxy.$refs.pixiContainer
  
  
  for (let i = 0; i < piecesY; i++) {
    for (let j = 0; j < piecesX; j++) {
      const piece = pieces[i * piecesX + j];
      const pieceSprite = new PuzzlePieceSprite(pixiBoard, puzzleTexture!, pieceWidth, pieceHeight, j, i, scaleX, scaleY, piecesDimensions);
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
    pieceMap.set(group, [...(pieceMap.get(group) ?? []), pieceSprite]);
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
    const pieceSprite: PuzzlePieceSprite = puzzlePieces[piece.idX][piece.idY];

    pieceSprite.setPosition(piece.position[0], piece.position[1]);
    pieceSprite.setInteractedUser(user);

    movePieceGroup(pieceSprite);
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
    if(piece.group === -9999) {
      pieceSprite.setCompleted(true);
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
    movePiece
  });
</script>

<style>
#pixiContainer {
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
