<template>
  <!-- <NavBar></NavBar> -->
  <RouterView/>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElAlert } from 'element-plus';
import { RouterView } from 'vue-router';

//Stop error resizeObserver
const debounce = (callback: (...args: any[]) => void, delay: number) => {
let tid: any;
return function (...args: any[]) {
const ctx = self;
tid && clearTimeout(tid);
tid = setTimeout(() => {
callback.apply(ctx, args);
}, delay);
};
};

const _ = (window as any).ResizeObserver;
(window as any). ResizeObserver = class ResizeObserver extends _ {
constructor(callback: (...args: any[]) => void) {
callback = debounce (callback, 20);
super(callback);
}
};
</script>
