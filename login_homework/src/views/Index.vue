<template>
  <div class="index" style="height: 100%">
    <el-container style="height: 100%">
      <el-header height="60px" style="background-color: #0165FF; padding: 0;">
        <div style="padding: 0 20px" class="header">
          <ul style="list-style-type: none;">

            <li style="margin-right: auto;" @click="collapseHandler">
              <h1 style="color: white">Welcome</h1>
            </li>

            <li>
              <el-dropdown>

                <h1 style="border: none;outline: none; color: white">
                  <el-icon>
                    <Avatar/>
                  </el-icon>
                </h1>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>账号管理</el-dropdown-item>
                    <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

            </li>

          </ul>


        </div>


      </el-header>


      <el-container>
        <el-aside :width="sideWidth"
                  style="border: none;background-color: #0165FF; height: 100%; transition: width 0.3s ease-in-out">
          <el-menu
              default-active="2"
              style="height: 100%;"
              :collapse="isCollapse"
              router
              background-color='#0165FF'
              text-color="white"
              active-text-color="--active-color"
          >
            <el-menu-item index="./index-page">
              <el-icon>
                <List/>
              </el-icon>
              <template #title>首页</template>
            </el-menu-item>
            <el-sub-menu index="">

              <template #title>
                <el-icon>
                  <User/>
                </el-icon>
                <span>学生查询</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="./my-score" :disabled="studentSearchDisable">我的成绩</el-menu-item>
                <el-menu-item index="./subject-list">课程列表</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2" :disabled="studentManageDisable">

              <template #title>
                <el-icon>
                  <icon-menu/>
                </el-icon>
                <span>学生管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="./student-manage" :disabled="studentListDisable">学生列表</el-menu-item>
                <el-menu-item index="./student-scores">学生成绩管理</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="5" :disabled="camperDisable">

              <template #title>
                <el-icon>
                  <setting/>
                </el-icon>
                <span>校园管理</span>
              </template>
              <el-menu-item-group disabled="">
                <el-menu-item index="./teacher-manage">教师管理</el-menu-item>
                <el-menu-item index="./class-manage">班级管理</el-menu-item>
                <el-menu-item index="./subject-manage">学科管理</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-aside>


        <el-main style="padding: 0;height: 100%; overflow: hidden;">
          <transition name="el-fade-in">
            <RouterView class="router-view"></RouterView>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import {ref} from 'vue';
import {
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'
import {get, post} from "@/http";
import router from "@/router/index.js";
import {useUserStore} from "@/stores/useUserScore.js";

const sideWidth = ref('64px')
const isCollapse = ref(true)

function collapseHandler() {
  isCollapse.value = !isCollapse.value
  if (!isCollapse.value) {
    sideWidth.value = '220px'
  } else {
    sideWidth.value = '64px'
  }

}

const userStore = useUserStore()

function logout() {
  post("/user/logout", null, (data, message) => {
    ElMessage.success(message)
    router.push("/login/sign-in")
    userStore.setNull()
  })
}

let user = userStore.getUser;
const studentSearchDisable = ref(false)
const studentManageDisable = ref(false)
const camperDisable = ref(false)
const studentListDisable = ref(false)
console.log(user)
console.log(user.account)

let role = user.account.role
if (role === 'admin' || role === 'teacher') {
  studentSearchDisable.value = true
}
if (role === 'teacher' || role === "student") {
  camperDisable.value = true
}

if (role === 'student') {
  studentManageDisable.value = true
} else if (role === 'student_representative') {
  studentListDisable.value = true
}


</script>

<style>
.el-menu {
  border: none;
}


.header {
  ul {

    margin: 0;
    padding: 0 20px;
  }

  h1,
  h2 {
    margin: 0;
    line-height: 60px;
  }

  li {
    display: flex;
    align-items: center;
  }

  ul {
    display: flex;
    justify-content: right;
  }
}


.left {
  float: left;
}

.right {
  float: right;
}


</style>
