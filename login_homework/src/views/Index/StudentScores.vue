<template>
  <div class="student-scores" style="height: 100%; padding: 20px;">
    <div>
      <el-form :inline="true">
        <el-form-item label="搜索查询" style="width: 30%">
          <el-input v-model="search" placeholder="科目或学生姓名或学号" clearable/>
        </el-form-item>
        <el-form-item label="成绩排序" style="width: 20%" >
          <el-select v-model="order" index="0">
            <el-option label="生序" value="0" />
            <el-option label="降序" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 10px">

          <el-button type="primary" @click="submitSearch(search)">查询</el-button>
        </el-form-item>
        <el-form-item style="margin-right: 10px">
          <el-button type="primary" @click="reset">复原</el-button>
        </el-form-item>
        <el-form-item style="margin-right: 10px">
          <el-button type="primary" @click="openAddTeacherDialog">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteStudent">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height: 100%" ref="scrollRef">

      <el-table :data="scoreData" min-height="100px" ref="tableRef"
                v-el-table-infinite-scroll="load" style="overflow: auto;"
                :height="scrollHeight"
                :v-el-table-infinite-scroll-delay="20000"

      >
        <el-table-column type="selection" width="30px"/>
        <el-table-column prop="name" label="学生"/>
        <el-table-column prop="username" label="学号"/>
        <el-table-column prop="subject" label="科目"/>
        <el-table-column prop="score" label="成绩" align="center"/>
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="scope">
            <el-link @click="changeScore(scope.$index)">修改分数</el-link>
          </template>

        </el-table-column>
      </el-table>
    </div>


    <el-dialog
        v-model="openDeleteDialog"
        title="确定吗？"
        width="500"
    >
      <span>您确定要删除如下成绩吗</span>
      <p v-for="item in deleteList"> {{ item.name + "(学号号：" + item.username +  ") 科目：" + item.subject + " 成绩" + item.score }} </p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openDeleteDialog = false">取消</el-button>
          <el-button type="primary" @click="deleteSelection">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="addScoreDialogVisible" title="成绩管理" width="500">
      <el-form :model="scoreForm">
        <el-form-item label="学生">
          <el-autocomplete
              :disabled="changeOrAdd"
              v-model="scoreForm.studentName"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchStudentAsync"
              placeholder="请输入学生姓名或学号"
              @select="handleStudentSelect"
          />
        </el-form-item>
        <el-form-item label="科目">
          <el-autocomplete
              :disabled="changeOrAdd"
              v-model="scoreForm.subjectName"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchSubjectAsync"
              placeholder="请输入学科名称"
              @select="handleSubjectSelect"
          />
        </el-form-item>
        <el-form-item label="分数" >
          <el-input v-model="scoreForm.score" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addScoreDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>


  </div>

</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { get, post } from '@/http'


const scoreData = reactive([])
const order = ref('0')
const search = ref('')
const page = ref(1)
const scrollHeight = ref(1);
const tableRef = ref()
const changeOrAdd = ref(true)
const scoreForm = reactive({
  id: "",
  studentName: "",
  student_id: "",
  subject_id: "",
  subjectName: "",
  score: "",
  gender: "男",
})

function querySearchSubjectAsync(queryString, cb) {
  scoreForm.subject_id = '';

  get("/student/search-subject/" + queryString , (data) => {
    const results = []
    for (const item of data) {
      results.push({
        value: item.name + ' (id:' + item.id + ')',
        id: item.id
      })
    }
    cb(results)
  })
}

function handleSubjectSelect(data) {
  scoreForm.subject_id = data.id
}

function querySearchStudentAsync(queryString, cb) {
  scoreForm.student_id = '';

  get("/teacher/search-student/" + queryString, (data) => {
    const results = []
    for (const item of data) {
      results.push({
        value: item.name + ' (学号:' + item.account.username + ')',
        id: item.id
      })
    }
    cb(results)
  })
}

function handleStudentSelect(data) {

  scoreForm.student_id = data.id
}

function load() {
  get('/teacher/scores/' + (page.value + 1) + "?search=" + search.value + "&order=" + order.value,
      (data) => {
        if(data.length !== 0) {
          page.value = page.value +  1
        }
        for (const item of data) {
          scoreData.push({
            id: item.id,
            username: item.student.account.username,
            name: item.student.name,
            score: item.score,
            subject: item.subject.name
          })
        }
      })
}

const addScoreDialogVisible = ref(false)
function openAddTeacherDialog() {

  changeOrAdd.value = false
  addScoreDialogVisible.value = true

  scoreForm.subjectName = ''
  scoreForm.studentName = ''
  scoreForm.subject_id = ''
  scoreForm.student_id = ''

}

function submit() {
  let url = changeOrAdd.value ?  "/teacher/change-score" : "/teacher/add-score"
  post(url, scoreForm,
      (data, message) => {
        ElMessage.success(message)
        getData(search.value)
      })
}



function changeScore(index) {
  addScoreDialogVisible.value = true
  scoreForm.id = scoreData[index].id
  scoreForm.studentName = scoreData[index].name
  scoreForm.subjectName = scoreData[index].subject
  scoreForm.score = scoreData[index].score
  console.log(scoreForm.studentName, scoreForm.subjectName)
  changeOrAdd.value = true

}

function reset() {
  getData('')
  tableRef.value.clearSelection()
}



function getData(search) {
  scoreData.length = 0
  for (let i = 1; i <= page.value; i++) {
    get('/teacher/scores/' + i + "?search=" + search + "&order=" + order.value,
        (data) => {

          for(const item of data) {
            scoreData.push({
              id: item.id,
              username: item.student.account.username,
              name: item.student.name,
              score: item.score,
              subject: item.subject.name
            })

          }
        })
  }

}

function submitSearch(search) {
  getData(search)
}

const deleteList = reactive([])
const openDeleteDialog = ref(false)
function deleteStudent() {
  deleteList.length = 0
  tableRef.value.getSelectionRows().forEach(element => {
    deleteList.push(element);
  })
  if (deleteList.length === 0) {
    ElMessage.warning("您还没有选择任何教师")
    return
  }
  openDeleteDialog.value = true

}

function deleteSelection() {
  openDeleteDialog.value = false
  if (deleteList.length === 0) {
    ElMessage.warning("您还没有选择任何成绩")
    return
  }
  deleteList.forEach(element => {
    let index = scoreData.indexOf(element)
    if (index !== -1) {
      scoreData.splice(index, 1);
      get("/teacher/remove-score/" + element.id, () => {
        ElMessage.success("删除了" + element.name + "的" + element.subject + "成绩")
      })
    }
  })
}

const scrollRef = ref()
const resizeObserver = new ResizeObserver(() => {

  // console.log(height);
});

onMounted(() => {
  resizeObserver.observe(scrollRef.value);
  const height = scrollRef.value.clientHeight
  scrollHeight.value = height - 100
  getData("")
})




</script>


<style scoped>

</style>



