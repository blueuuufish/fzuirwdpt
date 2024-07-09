<!-- <template>
  <div class="align-center" ref="pixiContainer" id="pixiContainer"></div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount,defineComponent, getCurrentInstance } from 'vue';
import { Application, Assets, Container, Sprite, Texture } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
// import PuzzlePieceSprite from './PuzzlePieceSprite.vue';
import { PuzzlePiece } from '@/shared/models/puzzlePieceModel'
import { Puzzle } from '@/shared/models/puzzleModel'
import { RoomUser } from '@/shared/models/roomUserModel'
// TODO: 修改 import { GameBoardComponent } from '../game-board/game-board.component';
import { PuzzlePieceSprite } from './PuzzelePieceSprite'
import {usePixiBoard} from './pixiBoard'


// TODO: 检查逻辑是否一致
export default defineComponent({
  name: 'PixiBoard',
  props: {},
  setup() {
    // const pixiContainer = ref<HTMLDivElement | null>(null);
    // const pixiApp = ref<Application | null>(null);
    // const pixiViewport = ref<Viewport | null>(null);
    // const pieceContainer = ref(new Container());
    // //TODO: const pieceMap = ref(new Map<number, typeof PuzzlePieceSprite[]>());PuzzlePieceSprite' refers to a value, but is being used as a type here. Did you mean 'typeof PuzzlePieceSprite'?Vetur(2749)
    // const puzzlePieces = ref<typeof PuzzlePieceSprite[][]>([]);
    // const pieceMap = ref(new Map<number, typeof PuzzlePieceSprite[]>());
    // const worldWidth = 2000;
    // const worldHeight = 1500;
    // const puzzleTexture = ref<Texture | null>(null);
    // const puzzle = ref<Puzzle | null>(null);
    // const activePuzzlePiece = ref<typeof PuzzlePieceSprite | null>(null);
    const {pixiContainer,pixiApp,pixiViewport,pieceContainer,puzzlePieces,pieceMap,worldWidth,worldHeight,puzzleTexture,puzzle,activePuzzlePiece,onDragMove } = usePixiBoard()

    onMounted(() => {
      if (pixiContainer.value) {
        pixiApp.value = new Application({
          antialias: true,
          backgroundAlpha: 0,
          resolution: 1,
          resizeTo: pixiContainer.value,
        });
        pixiViewport.value = new Viewport({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          worldWidth: worldWidth,
          worldHeight: worldHeight,
          events: pixiApp.value.renderer.events
        });

        pixiApp.value.stage.addChild(pixiViewport.value);
        pixiViewport.value
          .drag()
          .pinch()
          .wheel()
          .decelerate();

        pieceContainer.value.sortableChildren = true;
        pieceContainer.value.eventMode = 'static'
        pieceContainer.value.on('pointermove', (e: any) => onDragMove(e));

        pixiContainer.value.appendChild(pixiApp.value.view);
      }
    });

    const init = (puzzleData: Puzzle) => {
      reset();

      puzzle.value = puzzleData;
      setWorldSize(puzzleData.worldSize[0], puzzleData.worldSize[1]);

      Texture.fromURL(puzzleData.imageBase64).then((texture) => {
        puzzleTexture.value = texture;
        const bgSprite = new Sprite(texture);
        bgSprite.width = puzzleData.imageSize[0];
        bgSprite.height = puzzleData.imageSize[1];
        bgSprite.alpha = 0.5;

        const bgOffsetX = puzzleData.pieceSize[0] * PuzzlePieceSprite.SHAPE_OFFSET;
        const bgOffsetY = puzzleData.pieceSize[1] * PuzzlePieceSprite.SHAPE_OFFSET;
        bgSprite.position.set(worldWidth / 2 - bgSprite.width / 2 - bgOffsetX, worldHeight / 2 - bgSprite.height / 2 - bgOffsetY);

        pixiViewport.value?.addChild(bgSprite);
        pixiViewport.value?.addChild(pieceContainer.value);
        pixiViewport.value?.moveCenter(bgSprite.position.x + bgSprite.width / 2, bgSprite.position.y + bgSprite.height / 2);

        createPieces(puzzleData.pieceSize, puzzleData.piecesDimensions, puzzleData.puzzlePieces);
        pixiApp.value?.resize();
      });
    };

    const reset = () => {
      pieceMap.value.clear();
      puzzlePieces.value = [];
      pixiViewport.value?.removeChildren();
      pieceContainer.value.removeChildren();
    };

    const setWorldSize = (worldWidth: number, worldHeight: number) => {
      pixiViewport.value?.resize(worldWidth, worldHeight);
      pixiViewport.value?.clamp({ direction: 'all' });
      pixiViewport.value?.clampZoom({
        minWidth: pixiViewport.value.screenWidth / 3,
        minHeight: pixiViewport.value.screenHeight / 3,
        maxWidth: pixiViewport.value.worldWidth,
        maxHeight: pixiViewport.value.worldHeight,
      });
      pixiViewport.value?.setZoom(0.01, true);
    };

    const createPieces = (pieceSize: number[], piecesDimensions: number[], pieces: PuzzlePiece[]) => {
      const scaleX = puzzle.value?.imageSize[0] / (puzzleTexture.value?.width ?? 1);
      const scaleY = puzzle.value?.imageSize[1] / (puzzleTexture.value?.height ?? 1);

      const pieceWidth = pieceSize[0];
      const pieceHeight = pieceSize[1];
      const piecesX = piecesDimensions[0];
      const piecesY = piecesDimensions[1];

      puzzlePieces.value = new Array(piecesX).fill(undefined).map(() => new Array(piecesY).fill(undefined));

      const { ctx } = getCurrentInstance() as any
      const _this = ctx      

      for (let i = 0; i < piecesY; i++) {
        for (let j = 0; j < piecesX; j++) {
          const piece = pieces[i * piecesX + j];
          const pieceSprite = new PuzzlePieceSprite(_this, puzzleTexture.value!, pieceWidth, pieceHeight, j, i, scaleX, scaleY, piecesDimensions);
          pieceSprite.setPosition(piece.position[0], piece.position[1]);
          setGroup(pieceSprite, piece.group);

          if (piece.group === -9999) {
            pieceSprite.setCompleted(true);
          }

          puzzlePieces.value[j][i] = pieceSprite;
          pieceContainer.value.addChild(pieceSprite);
        }
      }
    };

    const setGroup = (pieceSprite: PuzzlePieceSprite, group: number) => {
      if (pieceSprite.group !== group && pieceMap.value.has(pieceSprite.group)) {
        pieceMap.value.set(pieceSprite.group, pieceMap.value.get(pieceSprite.group)!.filter((ps) => ps !== pieceSprite));
      }

      pieceSprite.setGroup(group);

      if (pieceMap.value.has(group)) {
        pieceMap.value.set(group, [...(pieceMap.value.get(group) ?? []), pieceSprite]);
      } else {
        pieceMap.value.set(group, [pieceSprite]);
      }
    };

    const onDragMove = (event: any) => {
      if (activePuzzlePiece.value) {
        activePuzzlePiece.value.onDragMove(event);
      }
    };

    return {
      pixiContainer,
      init,
      setGroup,
    };
  },
});
</script>

<style scoped>
#pixiContainer {
  display: flex;
  width: 100%;
  height: 100%;
}
</style> -->
