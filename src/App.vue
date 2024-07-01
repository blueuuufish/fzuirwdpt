<template>
  <RouterView/>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElAlert } from 'element-plus';
import { RouterView } from 'vue-router';
</script>
