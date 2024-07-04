<template>
  <div class="wrapper">
    <header class="header">
      <el-button type="primary" icon="el-icon-s-home" class="header-btn">大厅</el-button>
      <nav class="nav-links">
        <router-link to="/" class="nav-link">登入</router-link>
        <router-link to="/room" class="nav-link">房间</router-link>
      </nav>
    </header>
    <div id="main-panel" class="container">
      <div class="form-container">
        <h2 class="title">加入大厅</h2>
        <el-form :model="form" :rules="rules" ref="formRef" class="main-form">
          <el-form-item label="" prop="playerName" class="form-item">
            <el-input
                v-model="form.playerName"
                placeholder="Player Name"
                class="input-field"
                prefix-icon="el-icon-user"
            >
            </el-input>
            <el-alert v-if="form.playerName && form.playerName.length < 4" type="error" show-icon class="error-alert">
              Name should be at least <strong>4 characters long</strong>
            </el-alert>
          </el-form-item>
          <el-button type="primary" native-type="submit" class="main-btn" @click="onSubmit">
            加入
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElAlert } from 'element-plus';

const form = ref({
  playerName: ''
});

const rules = {
  playerName: [
    { required: true, message: 'Please input player name', trigger: 'blur' },
    { min: 4, message: 'Name should be at least 4 characters long', trigger: 'blur' }
  ]
};

const formRef = ref(null);

const router = useRouter();

const onSubmit = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        console.log('Form submitted:', form.value);
        router.push('/lobby_nav'); // 导航到房间页面
      } else {
        console.log('Form validation failed');
      }
    });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.wrapper {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409EFF;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.header-btn {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 10px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.nav-link:hover {
  text-decoration: underline;
}

.container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-weight: bold;
}

.main-form {
  width: 100%;
}

.form-item {
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
}

.error-alert {
  margin-top: 10px;
}

.main-btn {
  align-self: center;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
}
</style>
