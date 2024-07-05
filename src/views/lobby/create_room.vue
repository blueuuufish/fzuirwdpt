<template>
  <div class="create-room-panel">
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
                    @click="selectImage(image)"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-button type="primary" @click="uploadImage" class="upload-btn"
          >上传图片</el-button
          >
          <input
              ref="fileInput"
              type="file"
              @change="handleFileUpload"
              style="display: none"
          />
        </div>
        <el-form-item class="form-item">
          <el-button type="primary" @click="onSubmit" class="create-btn"
          >创建</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLobbyService } from "@/api/lobby/lobbyService";
import { LobbyCreateRoomDto } from "@/shared/models/dto/lobbyCreateRoomDto";
import convertImageToBase64 from "@/utils/convertImageToBase64";
const form = ref({
  pieces: 20,
  userCapacity: 3,
  puzzleImage: "",
});

const defaultImages = ref([]);
const imageFiles = ref([]);

// 本地图片路径
const imagePaths = [
  require("@/assets/default_images/default001.jpg"),
  require("@/assets/default_images/default002.jpg"),
  require("@/assets/default_images/default003.jpg"),
  require("@/assets/default_images/default004.jpg"),
  require("@/assets/default_images/default005.jpg"),
  require("@/assets/default_images/default006.jpg"),
];

onMounted(async () => {
  for (const path of imagePaths) {
    const response = await fetch(path);
    const blob = await response.blob();
    const file = new File([blob], path.substring(path.lastIndexOf("/") + 1), {
      type: blob.type,
    });
    imageFiles.value.push(file);
    defaultImages.value.push(URL.createObjectURL(file));
  }
});

const selectImage = (image) => {
  form.value.puzzleImage = image;
  // console.log(imageFiles);
};

const uploadImage = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageUrl = e.target.result;
      defaultImages.value.push(imageUrl); // 将上传的图片加入到defaultImages数组中
      form.value.puzzleImage = imageUrl; // 设置为选中的图片
    };

    reader.readAsDataURL(file); // 读取文件并转换为Data URL
  }
};

const fileInput = ref(null);
let rs = "";
const onSubmit = () => {
  // if (formRef.value) {
  //   formRef.value.validate((valid) => {
  //     if (valid) {
  //       // 处理表单提交
  //       const lobbyService = useLobbyService();
  //       // lobbyService.createRoom(new LobbyCreateRoomDto({}),form.value.puzzleImage)
  //       const dto = new LobbyCreateRoomDto(
  //           { pieces: form.value.pieces,
  //             userCapacity: form.value.userCapacity
  //           })
  //       lobbyService.createRoom(dto,form.value.puzzleImage)
  //       console.log(form.value)
  //       ElMessage.success('表单已提交!');
  //     } else {
  //       ElMessage.error('提交错误!');
  //     }
  //   });
  // }
  // 处理表单提交
  const lobbyService = useLobbyService();
  // lobbyService.createRoom(new LobbyCreateRoomDto({}),form.value.puzzleImage)
  // const dto = new LobbyCreateRoomDto({
  //   pieces: form.value.pieces,
  //   userCapacity: form.value.userCapacity,
  // });

  console.log(imageFiles.value[0])
  convertImageToBase64(
      imageFiles.value[0],
      (result) => {
        console.log(result);
        rs = result;
        lobbyService.createRoom(
            {
              pieces: form.value.pieces,
              userCapacity: form.value.userCapacity,
            },
            imageFiles.value[0]
        );
      },
      (error) => {
        this.conversionError = error;
      }
  );
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
  font-family: "Roboto", sans-serif;
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