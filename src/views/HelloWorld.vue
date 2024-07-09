<script setup>
// 父组件调用子组件方法-子组件
const childMethod = (val) => {
  console.log(val);
};
// 重点！！这里需要使用defineExpose暴露出去
defineExpose({
  childMethod,
});
</script>