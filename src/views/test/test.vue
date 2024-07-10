<script setup>
import HelloWorld from "./HelloWorld.vue";
import {ref, onMounted, nextTick, computed} from "vue";
const parentComponent = ref();

onMounted(() => {
  nextTick(() => {
    parentComponent.value.childMethod("我是父组件，调用子组件中的方法"); //调用子组件的方法
  });
});
const test = computed(() => {
  parentComponent.value.childMethod("我是父组件，调用子组件中的方法"); //调用子组件的方法
});

</script>

<template>
  <HelloWorld
      msg="Hello 我是props传递的值"
      ref="parentComponent"
  />
</template>