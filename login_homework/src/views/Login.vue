<template>

  <div class="login">

    <el-container style="height: 100%;">
      <el-main style="position: relative; height: 100%;padding: 0;overflow: hidden;">
        <h1 style="font: normal 700 26px sans-serif; font-family: '楷体_GB2312',serif; ;position: absolute; bottom: 40px; left: 40px; z-index: 1">
          富强
          民主
          文明 和谐 自由 平等
          公正 法治 爱国
          敬业 诚信 友善</h1>
        <el-image fit="cover" style="width: 100%;height: 100%;" :src="background"/>
      </el-main>
      <el-aside class="side" style="padding: 30px; min-width: 380px;display: flex;align-items: center;">
        <transition name="el-fade-in">
          <RouterView class="router-view"></RouterView>
        </transition>
      </el-aside>
    </el-container>
  </div>


</template>

<script setup>
import background from '@/assets/background.jpeg'
import {useUserStore} from "@/stores/useUserScore.js";
import router from "@/router/index.js";

const userScore = useUserStore()
if (userScore.isExisted()) {
  router.push("/")
}
</script>

<style scoped>
.login {
  height: 100%;
}
</style>
