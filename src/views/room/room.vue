<template>
  <div class="app">
    <el-button @click="goBack" class="back-button">Back</el-button>
    <div class="content">
      <el-card class="room-card">
        <div class="room-id">#FFI002</div>
        <div class="room-status">per: 1/3</div>
        <el-button type="primary" class="join-button">Join</el-button>
      </el-card>
    </div>
  </div>
</template>
  
  <script>
import { defineComponent } from "vue";
import { ElButton, ElCard } from "element-plus";
import "element-plus/dist/index.css";

export default defineComponent({
  name: "App",
  components: {
    ElButton,
    ElCard,
  },
  methods: {
    goBack() {
      // 返回操作
    },
  },
});
</script>
  
  <style>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #333;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.room-card {
  background-color: #444;
  color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
}

.room-id {
  font-size: 24px;
  margin-bottom: 10px;
}

.room-status {
  font-size: 16px;
  margin-bottom: 20px;
}

.join-button {
  background-color: #409eff;
  color: #fff;
}
</style>
  