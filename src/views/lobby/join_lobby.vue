<template>
  <div class="main-panel">
    <h2>Join to Lobby</h2>
    <form @submit.prevent="onSubmit" class="main-container">
      <div class="form-field">
        <span class="icon">😊</span>
        <input
            v-model="playerName"
            type="text"
            id="playerName"
            name="playerName"
            placeholder="Player Name"
            :class="{ 'is-invalid': playerNameTouched && !isValidPlayerName }"
            @blur="playerNameTouched = true"
        />
        <div v-if="playerNameTouched && !isValidPlayerName" class="error">
          Name should be at least <strong>4 characters long</strong>
        </div>
      </div>
      <button type="submit" class="main-btn">Join</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSocketGameService } from '@/api/ws/socketGameService';
import {useServiceStore} from "@/store/service"

const playerName = ref('');
const playerNameTouched = ref(false);
const router = useRouter();
const socketGameService = useSocketGameService();

const isValidPlayerName = computed(() => {
  return playerName.value.length >= 4;
});

const client = useServiceStore().socketGameService;
const connectClient = (headers) => {
  return new Promise((resolve, reject) => {
    client.connect(headers, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
const connectAndSubscribe = async () => {
  try {
    await connectClient("hijimi");
    client.subscribe('/lobby', (message) => {
      console.log(message);
      const socketMessage = JSON.parse(message.body);
      console.log("111" + socketMessage.message);
    });
  } catch (error) {
    console.error('Failed to connect:', error);
  }
}


const onSubmit = () => {
  
  connectAndSubscribe()
  console.log('-----websocket connect-----');
  if (isValidPlayerName.value) {
    // 处理表单提交
    socketGameService.connect(playerName.value);
    console.log('表单已提交:', playerName.value);
    // connectAndSubscribe()
    
    router.push('/create_room'); // 导航到房间页面
  } else {
    playerNameTouched.value = true;
  }
};
</script>

<style scoped>
body {
  background-color: #912e2e;
  color: #fff;
  font-family: Arial, sans-serif;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.main-panel {
  background-color: #752222;
  padding: 60px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-field {
  position: relative;
  margin-bottom: 20px;
  width: 100%;
}

input[type="text"] {
  width: 100%;
  padding: 15px;
  padding-left: 50px;
  border: 1px solid #555;
  border-radius: 25px;
  background-color: #333;
  color: #fff;
  font-size: 18px;
}

.icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #fff;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.is-invalid {
  border-color: red;
}

.main-btn {
  background-color: #ffcc00;
  color: #000;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease;
  width: 100%;
}

.main-btn:hover {
  background-color: #e6b800;
}
</style>
