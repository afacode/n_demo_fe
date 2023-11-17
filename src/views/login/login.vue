
<template>
  <div class="login-box">
    <h1>登录</h1>
    <el-form ref="loginRef" class="login" :label-position="'left'" label-width="40px" :model="formLabelAlign">
      <el-form-item label="账号">
        <el-input v-model="formLabelAlign.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formLabelAlign.password" />
      </el-form-item>
      <el-form-item>

        <el-button type="primary" class="submit" @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormInstance } from 'element-plus'
const formLabelAlign = reactive({
  username: '',
  password: '',
})
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      return false
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>
<style lang="scss" scoped>
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  h1 {
    font-size: 28px;
    padding-bottom: 30px;
    text-align: center;
  }

  .login {
    width: 400px;
  }

  .submit {
    width: 100%;
  }
}
</style>