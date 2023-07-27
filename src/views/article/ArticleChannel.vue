<script setup>
  import {onMounted, ref} from 'vue'
  import {Edit,Delete} from '@element-plus/icons-vue'
  import {artGetChannelsService,artDelChannelService} from '../../api/article.js'
  import ChannelEdit from './components/ChannelEdit.vue';
  const channelList=ref([])
  const loading=ref(false)
  const dialog=ref()
  const getChannerList=async ()=>{
    loading.value=true
    const res=await artGetChannelsService()
    channelList.value=res.data.data
    loading.value=false
    // console.log(channelList.value)
  }
  onMounted(()=>getChannerList())
  // 编辑
  const onEditChannel=(row)=>{
    dialog.value.open(row)
  }
  // 删除
  const onDelChannel=async (row)=>{
    await ElMessageBox.confirm('你确认要删除该分类吗','温馨提示',{
      type:'warning',
      confirmButtonText:'确认',
      cancelButtonText:'取消'
    })
    await artDelChannelService(row.id)
    ElMessage.success('删除成功')
    getChannerList()
    
  }
  // 添加
  const onAddChannel=()=>{
    dialog.value.open({})
  }
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    
    <el-table v-loading="loading" :data="channelList" style="width: 100%;" border>
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- row就是channlList的每一项，$index下标 -->
        <template #default="{row ,$index}">
          <el-button type="primary" plain :icon="Edit" circle  @click="onEditChannel(row,$index)"></el-button>
          <el-button type="danger" plain :icon="Delete" circle @click="onDelChannel(row,$index)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <ChannelEdit ref="dialog" @success="getChannerList()"/>


  </page-container>
</template>
<style lang="scss" scoped>
</style>
