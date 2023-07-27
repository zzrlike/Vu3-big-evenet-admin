<script setup>
import {ref} from 'vue'
import {Delete,Edit} from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import {formatTime} from '@/utils/format.js'
import {artGetListService,artDelService} from '@/api/article.js'
import ArticleEdit from './components/ArticleEdit.vue'
const loading=ref(false)
const articleList= ref([]) //文章列表
const total=ref(0) //总条数
  // 定义请求参数对象
const params=ref({
    pagenum:1, //当前页
    pagesize:5, //每页显示的条数
    cate_id:'',
    state:''
  })
  // 基于params参数获取文章列表
const getArticleList=async ()=>{
  loading.value=true
  const res=await artGetListService(params.value)
  articleList.value=res.data.data
  total.value=res.data.total
  loading.value=false
}
const articleEditRef=ref()
getArticleList()
  // 编辑逻辑
  const onEdit=(row)=>{
    articleEditRef.value.open(row)
  }
// 处理分页逻辑
// 分页每页条数变化的函数
const onSizeChange=size=>{
  params.value.pagenum=1
  params.value.size=size
  getArticleList()
}
// 页码发生变化的函数
const onCurrentChange=size=>{
  params.value.pagenum=size
  getArticleList()
}
// 搜索的逻辑
const onSearch=()=>{
  params.value.pagenum=1 //重置页面
  getArticleList()
}
// 重置的逻辑=>将筛选条件清空
const onReset=()=>{
  params.value.pagenum=1
  params.value.cate_id=''
  params.value.state=''
  getArticleList()
}
//抽屉

// 添加逻辑
const onAddArticle=()=>{
  articleEditRef.value.open({})
}
// 添加或者编辑的成功的回调
const onsussess=(type)=>{
  if(type==='add'){
    // 如果是添加，最好渲染最后一个
    const lastPage=Math.ceil((total.value+1)/params.value.pagesize)
    params.value.pagenum=lastPage
    getArticleList()
  }else{
    // 如果是编辑，直接渲染到当前页即可
    getArticleList()
  }
}
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
   <!-- 表单区域 -->
   <el-form inline>
      <el-form-item label="文章分类：">
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state">
          <!-- 此处后台标记发布状态，就是通过中文标记的已发布、草稿 -->
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
   </el-form>
   <!-- 表格区域 -->
   <el-table :data="articleList" v-loading="loading">
    <el-table-column label="文章标题" prop="title">
      <template #default="{row}">
        <el-link type="primary" :underline="false">{{ row.title }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="分类" prop="cate_name"></el-table-column>
    <el-table-column label="发表时间" prop="pub_date">
      <template #default="{row}">
        {{ formatTime(row.pub_date) }}
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="state"></el-table-column>
    <el-table-column label="操作">
      <template #default="{row}">
        <el-button circle plain type="primary" :icon="Edit" @click="onEdit(row)"></el-button>
        <el-button circle plain type="danger" :icon="Delete" @click="onDeleteArticle(row)"></el-button>
      </template>
    </el-table-column>
   </el-table>
   <!-- 分页区域 -->
   <el-pagination
      v-model:current-page="params.pagenum" 
      v-model:page-size="params.pagesize"
      :page-sizes="[2,3,5,10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next "
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px;justify-content: flex-end;"
    />
  </page-container>
  <!-- 抽屉 -->
  <ArticleEdit ref="articleEditRef" @success="onsussess"/>
</template>
<style lang="scss" scoped>
</style>
