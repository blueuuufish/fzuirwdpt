<!-- <template>
  <el-card>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="main-container">
      <el-form-item label="Pieces" prop="pieces">
        <el-input-number v-model="form.pieces" :min="20" :max="1000"></el-input-number>
      </el-form-item>

      <el-form-item label="User Capacity" prop="userCapacity">
        <el-input-number v-model="form.userCapacity" :min="1" :max="5"></el-input-number>
      </el-form-item>

      <el-form-item label="Puzzle Image" prop="puzzleImage">
        <div class="image-panel">
          <div v-for="image in defaultImages" :key="image.name" class="image-item">
            <img :src="image.name" @click="clickOnDefaultImage(image)" :class="{ selected: image === puzzleImageFile }" />
          </div>
          <div v-if="puzzleImageFile" id="image-preview">
            <img :src="getUploadedImage()" />
          </div>
          <el-button type="primary" @click="uploadImage">Upload Image</el-button>
          <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useLobbyStore } from '@/api/lobby/lobbyStore';
import { useResourcesService } from '@/api/common/resourcesService';
import convertImageToBase64 from '@/utils/convertImageToBase64';

const lobbyService = useLobbyStore();
const resourcesService = useResourcesService();

const defaultImages = ref<File[]>([]);
const puzzleImageFile = ref<File | null>(null);

const form = reactive({
  pieces: 20,
  userCapacity: 3,
  puzzleImage: ''
});

const rules = {
  pieces: [{ required: true, message: 'Pieces must be between 20 and 1000', type: 'number', min: 20, max: 1000 }],
  userCapacity: [{ required: true, message: 'User Capacity must be between 1 and 5', type: 'number', min: 1, max: 5 }],
  puzzleImage: [{ required: true, message: 'Puzzle Image is required' }]
};

const formRef = ref();

onMounted(() => {
  for (let i = 0; i < 7; i++) {
    resourcesService.getImageAsFile(`assets/images/default00${i + 1}.jpg`).then((image: File) => {
      defaultImages.value.push(image);
    });
  }
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    setPuzzleImage(target.files[0]);
  }
};

const uploadImage = () => {
  (formRef.value?.$refs.fileInput as HTMLInputElement).click();
};

const clickOnDefaultImage = (image: File) => {
  setPuzzleImage(image);
};

const setPuzzleImage = (file: File) => {
  puzzleImageFile.value = file;
  convertImageToBase64(file, (result: string) => {
    form.puzzleImage = result;
  }, (error: string) => {
    ElMessage.error(error);
  });
};

const getUploadedImage = (): string => {
  return form.puzzleImage;
};

const onSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      lobbyService.createRoom({
        pieces: form.pieces,
        userCapacity: form.userCapacity
      }, puzzleImageFile.value!)
    } else {
      ElMessage.error('Please correct the errors before submitting.');
    }
  });
};
</script>

<style scoped>
.main-container {
  max-width: 600px;
  margin: auto;
}

.image-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  cursor: pointer;
}

.image-item.selected {
  border: 2px solid #409eff;
}

#image-preview {
  margin-top: 10px;
}

.is-invalid {
  border-color: red;
}
</style> -->
<template>
  <MainPanel title='创建房间'>
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="header">
          <span>创建房间</span>
        </div>
      </template>
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        class="form"
      >
        <el-form-item label="拼图块数" prop="pieces" class="form-item">
          <el-input-number
            v-model="form.pieces"
            :min="20"
            :max="1000"
            controls-position="right"
            class="input"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="用户容量" prop="userCapacity" class="form-item">
          <el-input-number
            v-model="form.userCapacity"
            :min="1"
            :max="5"
            controls-position="right"
            class="input"
          ></el-input-number>
        </el-form-item>
        <div class="image-panel form-item">
          <el-form-item label="拼图图片" class="image-form-item">
            <el-row :gutter="10">
              <el-col
                :span="8"
                v-for="(image, index) in defaultImages"
                :key="index"
              >
                <img
                  :src="image"
                  class="default-image"
                  :class="{ selected: image === form.puzzleImage }"
                  @click="selectImage(image,index)"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-button type="primary" @click="uploadImage" class="upload-btn">上传图片</el-button>
          <input
            ref="fileInput"
            type="file"
            @change="handleFileUpload"
            style="display: none"
          />
        </div>
        <el-form-item class="form-item">
          <el-button type="primary" @click="onSubmit" class="create-btn">创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </MainPanel>
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
