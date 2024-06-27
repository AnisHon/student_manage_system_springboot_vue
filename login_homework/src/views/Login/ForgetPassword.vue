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
            <el-text class="Title" style="font-size: 26px;display:inline-block;width:100%;text-align: center;">找回密码</el-text>
            <el-form-item label="账号" prop="username" >
                <el-input v-model="form.username" placeholder="请输入账号" ref="usernameInput"/>
            </el-form-item>
            <el-form-item label="重设密码" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password/>
            </el-form-item>
            <el-form-item label="确认密码" prop="repeatPassword">
                <el-input v-model="form.repeatPassword" type="password" placeholder="重复密码" show-password/>
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
                    <el-button type="primary" @click="getCode" style="width: 100%" color="#626aef">
                        {{ word }}
                    </el-button>
                </el-col>
                    

            </el-form-item>

            <el-form-item style="margin-top: 20px;">
                <el-button type="primary" @click="submit(ruleRef)" style="width: 100%; height: 40px; font-size: 16px;" color="#626aef">
                    更改密码
                 </el-button>
            </el-form-item>
    
        </el-form>


        <div>
            <router-link to="./sign-in" style="display: inline-block;width: 100%;text-align: center;">返回登陆</router-link>
        </div>

        
        
        
    </div>
</template>


<script setup>

import { post, get } from '@/http' 

import { reactive, ref } from 'vue';

const ruleRef = ref()


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
    } else if (value.length !=6) {
        callback(new Error('长度必须为6'))
    } else {
        callback()
    }
}

const repeatCheck = (rule, value, callback) => {
    if (value !== form.password) {
        callback(new Error('两次密码不同'))
    } else {
        callback()
    }
}

const form = reactive({
    username: "",
    password: "",
    code: "",
    repeatPassword: "",
})
   
const validationRule = reactive({
    username: [{ validator: validateUsername, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    code: [{ validator: validateCode, trigger: 'blur' }],
    repeatPassword: [{validator: repeatCheck, trigger: 'blur'}]
    
})

const word = ref('获取验证码')

let timer = null
function beginCountDown() {
    let i = 60;
    word.value = i + '秒';
    timer = setInterval(() => {
    if (i-- <= 0) {
        word.value = '获取验证码'
        clearInterval(timer)
    } else {
        word.value = i + '秒';
    }
}, 1000)
}

function getCode() {
    if (form.username.length == 0) {
        ElMessage.warning("请输入账号")
        return
    } 
    post("/user/send-reset-code", {
        username: form.username
    }, (data) => {
        ElMessage.success("发送成功，请前往邮箱接收")
        beginCountDown()
    })
    
}

function reset() {

    clearInterval(timer)
    word.value = '获取验证码'
}


function submit(ruleFormRef) {
    if (!ruleFormRef) return
    ruleFormRef.validate((valid) => {
        if (valid) {
            post("/user/reset-password", 
            {
                password: form.password,
                reqCode: form.code
            }, 
            (data, message) => {
                ElMessage.success("密码修改成功")
                reset()
            })
        } else {
            return false
        }
    })
    
}



</script>

<style scoped>

</style>