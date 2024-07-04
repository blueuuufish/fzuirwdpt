<template>
  <el-header class="navbar">
    <el-button type="primary" @click="clickOnBackBtn">
      返回
    </el-button>
    <span class="spacer"></span>
    <div id="username-panel">
      {{ socketGameData?.username }}
    </div>
    <el-button type="primary" @click="clickOnCreateRoomBtn">
      创建房间
    </el-button>
  </el-header>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  props: {
    socketGameData: Object,
  },
  setup() {
    const router = useRouter();

    const clickOnBackBtn = () => {
      router.push('/');
      // 处理返回按钮点击事件
    };

    const clickOnCreateRoomBtn = () => {
      router.push('/create_room');
    };

    return {
      clickOnBackBtn,
      clickOnCreateRoomBtn,
    };
  },
};
</script>
