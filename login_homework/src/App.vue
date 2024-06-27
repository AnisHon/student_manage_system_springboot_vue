<template>
  <RouterView></RouterView>
</template>

<script setup>
import {useUserStore} from "@/stores/useUserScore.js";
import {get} from "@/http"

const userStore = useUserStore()
get("/user/me", (data) => {
  console.log("app.vue:")
  console.log(data)
  userStore.setUser(data)
})

</script>

<style>


</style>