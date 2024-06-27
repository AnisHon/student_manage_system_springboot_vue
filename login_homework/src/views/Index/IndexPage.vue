<template>
  <div class="index-page">
    <div class="info">
      <div style="margin-top: 40px;height: 200px;">
        <h1 style="text-align: center;">你好{{ helloMessage }}</h1>
        <p style="text-align: center;">{{ currentTime }}</p>
      </div>

      <div>
        <h1 style="text-align: center;">日程安排</h1>
        <p style="text-align: center;">无</p>
      </div>
    </div>


    <div class="notice">
      <h1 style="text-align: center;">公告</h1>
      <ul>
        <li v-for="item in notices">{{ item }}</li>
      </ul>
    </div>

  </div>


</template>

<script setup>
import {ref, reactive} from 'vue';
import {useUserStore} from "@/stores/useUserScore.js";


const helloMessage = ref('')
const currentTime = ref('')
const notices = reactive(["第一条", "第二条"])

const user = useUserStore().getUser
helloMessage.value = user.name ? user.name : user.account.username

function setTime() {
  let date = new Date()
  currentTime.value = "现在时间：" +
      date.getFullYear() + "年" +
      (date.getMonth() + 1) + "月" +
      date.getDate() + "日" +
      date.getHours() + "时" +
      date.getMinutes() + "分" +
      date.getSeconds() + "秒"
}

setInterval(() => {
  setTime()
}, 1000)
setTime()
</script>

<style scoped>

.index-page {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .info {
    display: flex;
    flex-direction: column;
    width: 100%;


  }

  .notice {
    width: 100%;
  }

}

</style>