<template>
  <div ref="spriteContainer" class="sprite-container"></div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue';
import { Container, TilingSprite, Point, Texture } from 'pixi.js';
import { BevelFilter } from '@pixi/filter-bevel';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { OutlineFilter } from '@pixi/filter-outline';
import { createShape } from '@/utils/puzzleShapeCreator';
import { RoomUser } from '@/shared/models/roomUserModel';
import { PuzzlePieceSprite }  from '@/shared/models/puzzlePieceSpriteModel'


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
      type: Object as () => PixiBoardComponent,
      required: true,
    },
  },
  setup(props) {
    const spriteContainer = ref<HTMLDivElement | null>(null);
    const sprite = ref<TilingSprite | null>(null);
    const dragging = ref(false);
    const dragOffset = ref(new Point(0, 0));
    const interactedUser = ref<RoomUser | null>(null);
    const completed = ref(false);

    let shadowFilter: DropShadowFilter;
    let outlineFilter: OutlineFilter;

    onMounted(() => {
      if (spriteContainer.value) {
        const { tPieceWidth, tPieceHeight, scaleX, scaleY, piecesDimensions, tIdX, tIdY, puzzleTexture, pixiBoard } = props;
        
        const offsetX = tPieceWidth * 0.25;
        const offsetY = tPieceHeight * 0.25;

        sprite.value = new TilingSprite(puzzleTexture);
        sprite.value.tileScale.set(scaleX, scaleY);
        sprite.value.width = tPieceWidth + offsetX * 2;
        sprite.value.height = tPieceHeight + offsetY * 2;

        sprite.value.pivot.set(sprite.value.width / 2, sprite.value.height / 2);
        sprite.value.position.set(offsetX, offsetY);

        const topPiece = pixiBoard.getPuzzlePiece(tIdX, tIdY - 1);
        const leftPiece = pixiBoard.getPuzzlePiece(tIdX - 1, tIdY);

        const topTab = tIdY === 0 ? 0 : -topPiece!.tabs[2];
        const rightTab = tIdX === piecesDimensions[0] - 1 ? 0 : Math.random() < 0.5 ? 1 : -1;
        const bottomTab = tIdY === piecesDimensions[1] - 1 ? 0 : Math.random() < 0.5 ? 1 : -1;
        const leftTab = tIdX === 0 ? 0 : -leftPiece!.tabs[1];

        const tabs = [topTab, rightTab, bottomTab, leftTab];

        sprite.value.tilePosition.x = -tIdX * tPieceWidth + offsetX;
        sprite.value.tilePosition.y = -tIdY * tPieceHeight + offsetY;

        sprite.value.cacheAsBitmap = true;
        shadowFilter = new DropShadowFilter({ pixelSize: 1, blur: 1, alpha: 0.3 });
        sprite.value.filters = [new BevelFilter({
          thickness: Math.max(tPieceWidth * 0.0175, 1),
          lightAlpha: 0.15,
          shadowAlpha: 0.3,
          lightColor: 0xF7EFDA,
          rotation: 45,
          shadowColor: 0x000000,
        })];
        outlineFilter = new OutlineFilter(2, 0xFF0000);

        const shape = createShape(sprite.value.width / 2, sprite.value.height / 2, tPieceWidth, tPieceHeight, tabs, 0x3498db);

        shape.alpha = 0.8;
        sprite.value.mask = shape;

        spriteContainer.value.appendChild(sprite.value.view);

        sprite.value.interactive = true;
        sprite.value.buttonMode = true;
        sprite.value
          .on('pointerdown', onDragStart)
          .on('pointerup', onDragEnd)
          .on('pointerupoutside', onDragEnd)
          .on('pointermove', onDragMove);
      }
    });

    const onDragStart = (event: any) => {
      if (interactedUser.value || completed.value) return;

      const target = event.currentTarget;

      const newPosition = event.data.getLocalPosition(target);
      dragOffset.value.set(newPosition.x * target.scale.x, newPosition.y * target.scale.y);

      dragging.value = true;
      props.pixiBoard.setActivePuzzlePiece(this);
      props.pixiBoard.dragPieceSprite(this);
      if (sprite.value) {
        sprite.value.filters = [shadowFilter];
        sprite.value.zIndex = 999;
      }
    };

    const onDragEnd = (event: any) => {
      if (interactedUser.value || completed.value) return;

      dragging.value = false;
      props.pixiBoard.releasePieceSprite(this);
      props.pixiBoard.setActivePuzzlePiece(null);

      if (sprite.value) {
        sprite.value.zIndex = sprite.value.position.y - sprite.value.height / 2;
        sprite.value.filters = [];
      }
    };

    const onDragMove = (event: any) => {
      if (!dragging.value || interactedUser.value || completed.value) return;

      const target = event.currentTarget;

      const newPosition = event.data.getLocalPosition(target.parent);
      newPosition.x = newPosition.x - dragOffset.value.x + sprite.value!.pivot.x;
      newPosition.y = newPosition.y - dragOffset.value.y + sprite.value!.pivot.y;

      sprite.value!.position.set(newPosition.x, newPosition.y);

      props.pixiBoard.dragPieceSprite(this);

      sprite.value!.zIndex = target.position.y + target.height / 2;
    };

    const setInteractedUser = (user: RoomUser | null) => {
      interactedUser.value = user;
      dragging.value = false;

      if (user) {
        outlineFilter.color = user.getColorNumber();
        if (sprite.value) {
          sprite.value.filters = [outlineFilter];
        }
      } else {
        if (sprite.value) {
          sprite.value.filters = [];
        }
      }
    };

    const setPosition = (x: number, y: number) => {
      if (sprite.value) {
        sprite.value.position.set(x, y);
      }
    };

    const setGroup = (group: number) => {
      props.group = group;
    };

    const setCompleted = (isCompleted: boolean) => {
      completed.value = isCompleted;
      if (isCompleted && sprite.value) {
        sprite.value.interactive = false;
        sprite.value.zIndex = -999;
      }
    };

    return {
      spriteContainer,
      setInteractedUser,
      setPosition,
      setGroup,
      setCompleted,
    };
  },
});
</script>

<style scoped>
.sprite-container {
  width: 100%;
  height: 100%;
}
</style>