<template>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="id"
      label="房间名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="score"
      label="时间"
      width="180">
    </el-table-column>
  </el-table>
</template>
<script setup>
import request from '@/utils/request';
import {environment} from '@/environments/environment'
import  { ref,onMounted } from 'vue'
const tableData = ref(null);
onMounted(()=>{

  request.get({
    url: `${environment.apiUrl}/leaderboard/getAllPlayers`
  }).then((res)=>{
    
    tableData.value = res;
  })
})


</script>
<style lang="">
  
</style>