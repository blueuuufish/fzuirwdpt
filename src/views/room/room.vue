<template>
  <div v-if="room && room.id" class="room-container">
    <el-card class="room-id-card">
      <p>Room {{ room.id }}</p>
    </el-card>

    <div id="info-panel-container" class="unclickable">
      <div id="info-panel">
        <div id="player-list">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Players</span>
            </div>
            <ul>
              <li v-for="user in room.users" :key="user.id" class="user-item">
                <div :style="{ color: user.getColor() }">
                  {{ user.username }} ({{ user.id }})
                </div>
              </li>
            </ul>
          </el-card>
        </div>
      </div>
    </div>
    <span class="spacer"></span>
    <div id="action-panel" class="clickable">
      <el-tooltip content="缩小" placement="top">
        <el-button @click="zoomOut" size="mini" type="primary" circle>
          <ZoomOut />
        </el-button>
      </el-tooltip>
      <el-tooltip content="放大" placement="top">
        <el-button @click="zoomIn" size="mini" type="primary" circle>
          <ZoomIn />
        </el-button>
      </el-tooltip>
    </div>
<!--    <GameBoard id="gameBoard" ref="gameBoard"></GameBoard>-->
  </div>
</template>

<script>
import { ref } from 'vue';
import { ZoomIn, ZoomOut } from '@element-plus/icons-vue'; // 引入图标
// import GameBoard from '@/components/GameBoard.vue';

export default {
  name: 'RoomComponent',
  components: {
    // GameBoard,
    ZoomIn,
    ZoomOut
  },
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  setup() {
    // const gameBoard = ref(null);
    const zoomIn = () => {
      console.log('Zoom In');
    };

    const zoomOut = () => {
      console.log('Zoom Out');
    };

    return {
      // gameBoard,
      zoomIn,
      zoomOut
    };
  }
};
</script>

<style scoped>
.room-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.room-id-card {
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  color: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
}

#info-panel-container {
  position: absolute;
  top: 100px; /* 调整顶边距 */
  left: 10px;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  border-radius: 8px;
  padding: 10px;
}

#info-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

#player-list {
  margin-bottom: 10px;
}

.user-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

#action-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 10px; /* 添加按钮之间的间距 */
}

.unclickable {
  pointer-events: none;
}

.clickable {
  pointer-events: auto;
}

.spacer {
  flex-grow: 1;
}

.el-card {
  background-color: #424242; /* 确保卡片的背景色与页面匹配 */
  color: #fff; /* 卡片内容颜色 */
}

.el-button {
  background-color: #2196f3; /* 按钮颜色 */
  border-color: #2196f3;
  border-radius: 50%; /* 使按钮变圆 */
}

.el-button:hover {
  background-color: #1976d2; /* 按钮悬停颜色 */
  border-color: #1976d2;
}

.el-card__header {
  color: #fff;
}

/* 添加任何其他需要的样式 */
</style>
