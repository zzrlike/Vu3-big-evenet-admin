<script setup>
  import PageContainer from '@/components/PageContainer.vue'
  import {userUpdateInfoService} from '@/api/user.js'
  import {useUserStore} from '@/stores'
  const {user:{email,id,nickname,username},getUser}=useUserStore()
  import {ref} from 'vue'
import { ElMessage } from 'element-plus';
  const form=ref({
    id,
    username ,// 登录名称
    nickname, // 用户昵称
    email, // 用户邮箱
  })


    const rules = {
      nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        { pattern:/^\S{2,10}$/, message: '昵称长度在 2 到 10 个非空字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
      ]
    };
    const formRef=ref()
    const submitForm = async () => {

      await formRef.value.validate()
      // 提交修改
      await userUpdateInfoService(form.value)
      getUser()
      ElMessage.success('修改成功')
    };
</script>
<template>
  <page-container title="基本资料">
      <template #default>
        <el-form :rules="rules" ref="formRef" :model="form" label-width="120px">
          <el-form-item label="登录名称">
            <el-input v-model="username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交修改</el-button>
          </el-form-item>
        </el-form>
    </template>
  </page-container>
</template>