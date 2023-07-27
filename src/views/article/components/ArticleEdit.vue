<script setup>
import {ref} from 'vue'
const visibleDrawer=ref(false)
import ChannelSelect from './ChannelSelect.vue'
import {artPublishService,artGetDetailService,artEditService} from '@/api/article'
import {baseURL} from '@/utils/request'
import axios from 'axios'
  // 组件对外暴露一个open传来的参数，区分添加还是编辑
  // open({})=>表单无需渲染，说明是添加
  // open（{id，cate_name,.....}）=>说明是编辑
  // open调用后可以打开弹窗
  async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}

import {Plus} from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ElMessage } from 'element-plus';
  // 默认数据
  const defaultForm={
    title:'', //标题
    cate_id:'', //分类id
    cover_img:'', //封面图片
    content:'', //string内容
    state:'' //状态
  }
    // 准备收据
    const formModel=ref({
    ...defaultForm
  })
  const open=async (row)=>{
    visibleDrawer.value=true
    if(row.id){
      // 需要基于row.id发送请求，并且获取编辑对应的详情数据，进行回显
      // console.log('回显')
      const res=await artGetDetailService(row.id)
      formModel.value=res.data.data
      // 图片需要单独处理
      imgUrl.value=baseURL+formModel.value.cover_img
      const file =await imageUrlToFile(imgUrl.value,formModel.value.cover_img)
      formModel.value.cover_img=file
    }else{
      formModel.value={...defaultForm}//基于默认的数据，重置数据
      console.log('添加')
      imgUrl.value = ''
    }
  }
  
  defineExpose({
    open
  })
  const emit=defineEmits(['success'])
  // 图片上传相关逻辑
  const imgUrl=ref('')
  const onSelectFile=(onloadFile)=>{
    imgUrl.value=URL.createObjectURL(onloadFile.raw)
    formModel.value.cover_img=onloadFile.raw
  }
  // 提交或草稿
  const onPushlist=async (state)=>{
    // 将已发布还是草稿状态，存入formModel
    formModel.value.state=state
    // 将对象转换位formData对象
    const df=new FormData()
    for (let key in formModel.value){
      df.append(key,formModel.value[key])
    }
    // 发请求
    if(formModel.value.id){
      await artEditService(df)
      ElMessage.success('修改成功')
      visibleDrawer.value=false
      emit('success','edit')
    }else{
      await artPublishService(df)
      ElMessage.success('添加成功')
      visibleDrawer.value=false
      emit('success','add')
    }
  }
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img"> 
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>  
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor theme="snow" v-model:content="formModel.content" content-type="html"></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPushlist('已发布')">发布</el-button>
        <el-button type="info" @click="onPushlist('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>