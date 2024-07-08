<!-- <template>
  <div ref="spriteContainer" class="sprite-container"></div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted,onBeforeUnmount} from 'vue';
import { Container, TilingSprite, Point, Texture,Filter } from 'pixi.js';
import { BevelFilter } from '@pixi/filter-bevel';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { OutlineFilter } from '@pixi/filter-outline';
import { createShape } from '@/utils/puzzleShapeCreator';
import { RoomUser } from '@/shared/models/roomUserModel';
import { PuzzlePieceSprite }  from '@/shared/models/puzzlePieceSpriteModel'
import PixiBoard from './PixiBoard.vue';



// TODO: 检查逻辑是否一致
export default defineComponent({
  name: 'PuzzlePieceSprite',
  props: {
    puzzleTexture: {
      type: Object as () => Texture,
      required: true,
    },
    tPieceWidth: {
      type: Number,
      required: true,
    },
    tPieceHeight: {
      type: Number,
      required: true,
    },
    tIdX: {
      type: Number,
      required: true,
    },
    tIdY: {
      type: Number,
      required: true,
    },
    scaleX: {
      type: Number,
      required: true,
    },
    scaleY: {
      type: Number,
      required: true,
    },
    piecesDimensions: {
      type: Array as () => number[],
      required: true,
    },
    pixiBoard: {
      type: Object as () => typeof PixiBoard,
      required: true,
    }
  },
  data(){
    return{
      
    };
  },
  methods:{},
  created(){},
  
  emits: ['dragStart', 'dragEnd', 'dragMove'],
  setup(props) {
    const SHAPE_OFFSET = 0.25;
    const sprite = ref<TilingSprite>();
    // const shadowFilter = ref<DropShadowFilter>();
    const shadowFilter = new DropShadowFilter({pixelSize: 1, blur:1, alpha: 0.3});
    // const outlineFilter = ref<OutlineFilter>();
    const outlineFilter = new OutlineFilter(2, 0xFF0000);
    const interactedUser = ref<RoomUser | null>(null);
    const completed = ref(false);
    const dragging = ref(false);
    const dragOffset = ref(new Point(0, 0));
    // const spriteContainer = ref<HTMLDivElement | null>(null);
    const tabs = ref<number[]>([]);
    const idX = ref<number>();
    const idY = ref<number>();
    const group = ref<number>();
    const container = new Container();
    onMounted(() => {
      idX.value = props.tIdX;
      idY.value = props.tIdY;
      const offsetX = props.tPieceWidth * SHAPE_OFFSET;
      const offsetY = props.tPieceHeight * SHAPE_OFFSET;
      sprite.value = new TilingSprite(props.puzzleTexture);
      sprite.value.tileScale.set(props.scaleX, props.scaleY);
      sprite.value.width = props.tPieceWidth + offsetX * 2;
      sprite.value.height = props.tPieceHeight + offsetY * 2;
      container.width = sprite.value.width;
      container.height = sprite.value.height;
      sprite.value.pivot.set(container.width / 2, container.height / 2);
      container.pivot.set(container.width / 2 + offsetX,container.height / 2 + offsetY);
      const topPiece = props.pixiBoard.getPuzzlePiece(props.tIdX,props.tIdY-1);
      const leftPiece = props.pixiBoard.getPuzzlePiece(props.tIdX-1,props.tIdY);
      const topTab = props.tIdY === 0 ? 0 : -topPiece!.tabs[2];
      const rightTab = props.tIdX === (props.piecesDimensions[0]-1) ? 0 : Math.random() < 0.5 ? 1 : -1;
      const bottomTab = props.tIdY === (props.piecesDimensions[1]-1) ? 0 : Math.random() < 0.5 ? 1 : -1;
      const leftTab = props.tIdX === 0 ? 0 : -leftPiece!.tabs[1];
      tabs.value = [topTab, rightTab, bottomTab,  leftTab];
      sprite.value.tilePosition.x = 0 - (props.tIdX) * props.tPieceWidth + offsetX;
      sprite.value.tilePosition.y = 0 - props.tIdY * props.tPieceHeight + offsetY;
      container.zIndex = 1;
      // TODO: cacheAsBitmap不存在
      (sprite.value as any).cacheAsBitmap = true;
      // shadowFilter.value = new DropShadowFilter({pixelSize: 1, blur:1, alpha: 0.3});

      sprite.value.filters = [
        new BevelFilter({
            thickness: Math.max(props.tPieceWidth * 0.0175, 1),
            lightAlpha: 0.15,
            shadowAlpha: 0.3,
            lightColor: 0xf7efda,
            rotation: 45,
            shadowColor: 0x000000}) as unknown as Filter,
      ];
      // outlineFilter.value = new OutlineFilter(2, 0xFF0000);
      const shape = createShape(sprite.value.width/2,sprite.value.height/2,props.tPieceWidth, props.tPieceHeight, tabs.value, 0x3498db);
      shape.alpha = 0.8;
      sprite.value.mask = shape;
      container.addChild(sprite.value);
      container.eventMode = 'static'
      container.on('pointerdown',onDragStart).on('pointerup',onDragEnd).on('pointerupoutside',onDragEnd);
    });

    const setPosition= (x: number, y: number)=>{
        container.position.set(x,y);
    };

    const onDragStart = (event: any) => {
      if(interactedUser || completed) return;
      const target = event.currentTarget;
      const newPosition = event.data.getLocalPosition(target);
      dragOffset.value.set(newPosition.x * target.scale.x, newPosition.y * target.scale.y);
      dragging.value = true;
      props.pixiBoard.setActivePuzzlePiece(container);
      props.pixiBoard.dragPieceSprite(container);
      // TODO:错误 Type 'DropShadowFilter' is missing the following properties from type 'Filter': antialias, _state, blendRequired, gpuProgram, and 18 more.
      container.filters = [shadowFilter as unknown as Filter];
      container.zIndex = 999;
    };

    const onDragEnd = (event:any) => {
        if(interactedUser || completed) return;
        const target = event.currentTarget;
        dragging.value = false;
        props.pixiBoard.releasePieceSprite(container);
        props.pixiBoard.setActivePuzzlePiece(null);
        container.zIndex = target.position.y-target.height/2;
        container.filters = [];
    };

    const onDragMove = (event: any) => {
      if(!dragging || interactedUser || completed)
        return;

      const target = event.currentTarget;
      const newPosition = event.data.getLocalPosition(target.parent);
      newPosition.x = newPosition.x - dragOffset.value.x + container.x;
      newPosition.y = newPosition.y - dragOffset.value.y + container.y;
      setPosition(newPosition.x,newPosition.y);
      props.pixiBoard.dragPieceSprite(container)
      container.zIndex = target.position.y + target.height/2;
    };
    const setInteractedUser = (interactedUserD: RoomUser | null)=>{
      interactedUser.value = interactedUserD;
      dragging.value = false;
      if(interactedUserD){
        outlineFilter.color = interactedUserD.getColorNumber();
        // TODO:错误 Type 'DropShadowFilter' is missing the following properties from type 'Filter': antialias, _state, blendRequired, gpuProgram, and 18 more.
        container.filters = [outlineFilter as unknown as Filter];
      }else{
        container.filters = [];
      }
    };
    const getInteractedUser = ()=>{
      return interactedUser;
    };
    const setGroup = (groupD: number)=>{
      group.value = groupD;
    };
    const setCompleted = (completedD: boolean)=>{
      completed.value = completedD;
      if(completedD){
        container.eventMode = 'none';
        container.zIndex = -999;
      }
    };
    return {
      container,
      setPosition,
      onDragMove,
      setInteractedUser,
      getInteractedUser,
      setGroup,
      setCompleted
    };
  }
});
</script>
<style scoped>
</style> -->