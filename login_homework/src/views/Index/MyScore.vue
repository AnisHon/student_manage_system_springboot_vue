<template>
  <div style="padding: 20px">
    <el-descriptions title="学生信息">
      <el-descriptions-item label="学生索引">{{ studentInfo.id }}</el-descriptions-item>
      <el-descriptions-item label="学号">{{ studentInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{ studentInfo.name }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ studentInfo.gender }}</el-descriptions-item>
      <el-descriptions-item label="班级">{{ studentInfo.className }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ studentInfo.email }}</el-descriptions-item>
      <el-descriptions-item label="住址">
        <el-tag size="small">地址</el-tag>
        {{ studentInfo.address }}
      </el-descriptions-item>
      <el-descriptions-item label="总分">{{ studentInfo.total }}</el-descriptions-item>
      <el-descriptions-item label="平均分">{{ studentInfo.average }}</el-descriptions-item>
      <el-descriptions-item label="挂科">{{ studentInfo.fail }}</el-descriptions-item>
      <el-descriptions-item label="通过">{{ studentInfo.success }}</el-descriptions-item>
    </el-descriptions>
    <div class="el-descriptions__header" style="margin-top: 20px">
      <div class="el-descriptions__title">分数</div>

    </div>
    <el-table :data="studentInfo.scores" style="min-height: 200px; margin-top: 20px;" ref="tableRef"
    >
      <el-table-column label="科目">
        <template #default="scope">
          <div>
            <span style="margin-left: 10px">{{ scope.row.subject.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="分数">
        <template #default="scope">
          <div>
            <span style="margin-left: 10px">{{ scope.row.score }}</span>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script setup>
import {reactive} from "vue";
import {get} from "@/http/index.js";

const studentInfo = reactive({
  total: 0,
  average: 0,
  fail: 0,
  success: 0
})

function getMyself() {

  get("/student/me", (data) => {


    studentInfo.address = data.address
    studentInfo.username = data.account.username
    studentInfo.email = data.account.email ? data.account.email : "未设置"
    studentInfo.name = data.name
    studentInfo.age = data.age
    studentInfo.gender = data.gender
    studentInfo.className = data.clazz.name
    studentInfo.id = data.id
    studentInfo.scores = data.scores

    let sum = 0
    for (let score of studentInfo.scores) {
      if (score.score < 60) {
        studentInfo.fail++
      } else {
        studentInfo.success++
      }
      sum += score.score
    }
    studentInfo.total = sum
    studentInfo.average = sum / studentInfo.scores.length


  })
}

getMyself();

</script>
<style scoped>

</style>