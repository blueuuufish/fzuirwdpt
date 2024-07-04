<template>
  <div class="wrapper">
    <header class="header">
      <el-button type="primary" icon="el-icon-s-home">Lobby</el-button>
      <nav class="nav-links">
        <router-link to="/" class="nav-link">Login</router-link>
        <router-link to="/room" class="nav-link">Room</router-link>
      </nav>
    </header>
    <div id="main-panel" class="container">
      <h2 class="title">Join to Lobby</h2>
      <el-form :model="form" :rules="rules" ref="formRef" class="main-container">
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
          Join
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup >
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElAlert } from 'element-plus';
import { useSocketGameService } from '@/api/ws/socketGameService';
import {useLobbyService} from '@/api/lobby/lobbyService'

const form = ref({
  playerName: ''
});
const lobbyService = useLobbyService()
// const sleep = (ms) => {
//   return new Promise(resolve => setTimeout(resolve, ms));
// };
// const client = useSocketGameService();
// client.connect("hijimi")
// const connectAndSubscribe = async () => {
//   await sleep(10000);
//   client.subscribe('/lobby', (message) => {
//       console.log(message);
//       const socketMessage = JSON.parse(message.body);
//       console.log("111" + socketMessage.message);
//     });
// }
// const connectClient = (headers) => {
//   return new Promise((resolve, reject) => {
//     client.connect(headers, (error) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve();
//       }
//     });
//   });
// };
// const connectAndSubscribe = async () => {
//   try {
//     await connectClient("hijimi");
//     client.subscribe('/lobby', (message) => {
//       console.log(message);
//       const socketMessage = JSON.parse(message.body);
//       console.log("111" + socketMessage.message);
//     });
//   } catch (error) {
//     console.error('Failed to connect:', error);
//   }
// };


  
  onMounted(()=>{
    // connectAndSubscribe()
    // const client = new useSocketGameService();
      // const client = useSocketGameService();
      // client.connect("hijimi")
      // sleep(20000)
      // client.subscribe('/lobby',(message)=>{
      //   console.log(message)
      //   const socketMessage = JSON.parse(message.body);
      //   console.log("111"+socketMessage)
      // })
      
  })


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
        router.push('/room'); // 导航到房间页面
      } else {
        console.log('Form validation failed');
      }
    });
  }
};

</script>

<style scoped>
/* 添加原有的样式 */
</style>
