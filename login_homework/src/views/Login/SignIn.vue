<template>
  <div class="sign-in">

    <el-form
        label-position="top"
        :model="form"
        :rules="validationRule"
        ref="ruleRef"
        status-icon
        class="sign-in-form"
        style="min-width: 300px;"
    >
      <el-text class="Title" style="font-size: 26px;display:inline-block;width:100%;text-align: center;">校园管理页面
      </el-text>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password/>
      </el-form-item>
      <el-form-item label="验证码" prop="code">

        <el-col :span="14">
          <el-input
              v-model="form.code"
              height="120px"
              placeholder="请输入验证码"
              style="height: 36px;"
              :max-length="5"
              :min-length="5"
          />
        </el-col>

        <el-col :span="8" style="margin-left: 23px;">
          <el-image @click="getCode" style="height: 36px;float: right;" :src="image" fit="fill"/>
        </el-col>


      </el-form-item>

      <el-form-item>

        <el-col :span="12">
          <el-checkbox v-model="form.remember" label="记住我" size="large" color="#626aef" style="float: left;"/>
        </el-col>
        <el-col :span="12">
          <router-link to="./forget" style="float: right;">忘记密码</router-link>
        </el-col>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit(ruleRef)" style="width: 100%; height: 40px; font-size: 16px;"
                   color="#626aef">
          登陆
        </el-button>
      </el-form-item>


    </el-form>


  </div>
</template>


<script setup>

import {post, get} from '@/http'
import {reactive, ref} from 'vue';
import router from "@/router/index.js";
import {useUserStore} from "@/stores/useUserScore.js";

const ruleRef = ref()
const image = ref('')


const validateUsername = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }

}

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else if (value.length < 8 || value.length > 16) {
    callback(new Error('密码长度必须为8-16'))
  } else {
    callback()
  }
}

const validateCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入验证码'))
  } else if (value.length !== 5) {
    callback(new Error('长度必须为5'))
  } else {
    callback()
  }
}

const form = reactive({
  username: "",
  password: "",
  code: "",
  remember: true
})

const validationRule = reactive({
  username: [{validator: validateUsername, trigger: 'blur'}],
  password: [{validator: validatePassword, trigger: 'blur'}],
  code: [{validator: validateCode, trigger: 'blur'}],

})


function getCode() {
  get("/user/code", (data) => {
    image.value = data
  })

}

const userScore = useUserStore()

function submit(ruleFormRef) {
  if (!ruleFormRef) return
  ruleFormRef.validate((valid) => {
    if (valid) {
      post("/user/login", form,
          (data) => {
            ElMessage.success("登陆成功")
            userScore.setUser(data)
            router.push("/")
          },
          (code, message) => {
            getCode()
            ElMessage.warning(message)
          }
      )
    } else {
      return false
    }
  })

}

getCode()

</script>

<style scoped>

</style>