<template lang="">
  <div id="header">
  <h1>{{ title }}</h1>
  <slot></slot>
  </div>
</template>
<script lang='ts' setup>
import { defineProps } from 'vue';
const props = defineProps<{
  title: string;
}>();

</script>
<style lang="scss">
:host {
  display: block;
  width: 300px !important;
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 36px;
#header {
    margin-bottom: 30px;
    text-align: center;
  }
}

</style>