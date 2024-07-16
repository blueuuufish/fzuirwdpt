<!-- create-room.vue -->
<template>
  <view class="main-panel">
    <uni-card class="box-card" shadow="hover">
      <view slot="title" class="header">
        创建房间
      </view>
      <uni-forms :modelValue="form" :rules="rules" ref="formRef" label-width="100px" class="form" @submit="onSubmit">
        <uni-forms-item label="拼图块数" name="pieces" class="form-item">
          <uni-number-box v-model="form.pieces" :min="20" :max="1000" controls-position="right" class="input"></uni-number-box>
        </uni-forms-item>
        <uni-forms-item label="用户容量" name="userCapacity" class="form-item">
          <uni-number-box v-model="form.userCapacity" :min="1" :max="5" controls-position="right" class="input"></uni-number-box>
        </uni-forms-item>
        <view class="image-panel form-item">
          <uni-forms-item label="拼图图片" class="image-form-item">
            <view class="image-row">
              <view v-for="(image, index) in defaultImages" :key="index" class="image-col">
                <image :src="image" class="default-image" :class="{ selected: image === form.puzzleImage }" @click="selectImage(image, index)" />
              </view>
            </view>
          </uni-forms-item>
          <uni-button type="primary" @click="uploadImage" class="upload-btn">上传图片</uni-button>
          <input ref="fileInput" type="file" @change="handleFileUpload" style="display: none" />
        </view>
        <uni-forms-item class="form-item">
          <uni-button type="primary" form-type="submit" class="create-btn">创建</uni-button>
        </uni-forms-item>
      </uni-forms>
    </uni-card>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLobbyService } from "@/api/lobby/lobbyService";
import { LobbyCreateRoomDto } from "@/shared/models/dto/lobbyCreateRoomDto";
import convertImageToBase64 from "@/utils/convertImageToBase64";
import {useSocketStore} from "@/api/ws/socketStore"
import {useRouter} from 'vue-router'
import MainPanel from '@/shared/components/MainPanel'

const form = ref({
  pieces: 20,
  userCapacity: 3,
  puzzleImage: '',
});

const defaultImages = ref([]);
const imageFiles = ref([]);
const router = useRouter();
const puzzleImage = ref(null)

const imagePaths = [
  require('@/assets/default_images/default001.jpg'),
  require('@/assets/default_images/default002.jpg'),
  require('@/assets/default_images/default003.jpg'),
  require('@/assets/default_images/default004.jpg'),
  require('@/assets/default_images/default005.jpg'),
  require('@/assets/default_images/default006.jpg'),
];

// const rules: {
//       pieces: {
//         rules: [{ required: true, message: '请选择拼图块数' }],
//       },
//       userCapacity: {
//         rules: [{ required: true, message: '请选择用户容量' }],
//       },
//     },

onMounted(async () => {

  for (const path of imagePaths) {
    const response = await fetch(path);
    const blob = await response.blob();
    const file = new File([blob], path.substring(path.lastIndexOf('/') + 1), {
      type: blob.type,
    });
    imageFiles.value.push(file);
    defaultImages.value.push(URL.createObjectURL(file));
    // defaultImages.value.push(URL.createObjectURL(file));
  }
});

const selectImage = (image,index) => {
  console.log(imageFiles.value)
  // console.log(index)
  if(index>=0){
    puzzleImage.value = imageFiles.value[index]
  }
  form.value.puzzleImage = image;
  
  // form.value.puzzleImage = image;
  // console.log(form.value.puzzleImage)
  
};

const uploadImage = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  imageFiles.value.push(file)
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageUrl = e.target.result;
      defaultImages.value.push(imageUrl);
      form.value.puzzleImage = imageUrl;
    };

    reader.readAsDataURL(file);
  }
  selectImage(file,imageFiles.value.length-1)
};

const fileInput = ref(null);

const onSubmit = () => {
  const lobbyService = useLobbyService();
  console.log()
  lobbyService.createRoom(
    {
      pieces: form.value.pieces,
      userCapacity: form.value.userCapacity,
    },
    puzzleImage.value
  );
  lobbyService.changeCreatingRoom(false);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.create-room-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
  font-family: 'Roboto', sans-serif;
}

.box-card {
  width: 400px;
  padding: 30px;
  background-color: #2c2c2c;
  border-radius: 15px;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.header {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  color: #cccccc;
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  background-color: #333333;
  color: #ffffff;
}

.image-panel {
  text-align: center;
}

.image-form-item {
  margin-bottom: 10px;
}

.image-form-item label {
  color: #cccccc;
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 8px;
}

.default-image {
  width: 100%;
  height: 80px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: transform 0.3s ease, border-color 0.3s ease;
  object-fit: cover;
}

.default-image:hover {
  transform: scale(1.05);
}

.default-image.selected {
  border-color: #409eff;
}

.upload-btn {
  margin-top: 10px;
  width: 100%;
  font-size: 16px;
  background-color: #606060;
  border-color: #606060;
  color: #ffffff;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.upload-btn:hover {
  background-color: #808080;
  border-color: #808080;
}

.create-btn {
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  background-color: #409eff;
  border-color: #409eff;
  color: #ffffff;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.create-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
</style>
