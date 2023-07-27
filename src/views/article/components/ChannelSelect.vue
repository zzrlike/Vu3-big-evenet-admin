<script setup>
import {artGetChannelsService} from '@/api/article.js'
import {ref} from 'vue'
const channelList=ref([])
const getChannelList=async ()=>{
  const res=await artGetChannelsService()
  channelList.value=res.data.data
  console.log( channelList.value)
}
getChannelList()
defineProps({
  modelValue:{
    type:[Number,String]
  },
  width:{
    type:String
  }
})
const emit=defineEmits(['update:modelValue'])
</script>
<template>
  <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue',$event)" :style="{width}">
          <!-- label:展示给用户看 value:提交给后台 -->
          <el-option :label="item.cate_name" :value="item.id" v-for="item in channelList" :key="item.id"></el-option>
  </el-select>
</template>