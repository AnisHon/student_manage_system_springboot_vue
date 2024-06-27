<template>
  <div class="teacher-manage" style="height: 100%; padding: 20px;">
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="搜索教工号或姓名" style="width: 40%">
          <el-input v-model="search" placeholder="教工号或教工姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData(search)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reset">复原</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAddTeacherDialog">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteStudent">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height: 100%" ref="scrollRef">

      <el-table :data="teacherData" min-height="100px" ref="tableRef"
                v-el-table-infinite-scroll="load" style="overflow: auto;"
                :height="scrollHeight"
                :v-el-table-infinite-scroll-delay="20000"
        
      >
        <el-table-column type="selection" width="30px"/>
        <el-table-column prop="username" label="教工号"/>
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="gender" label="性别" align="center" width="60px"/>
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="scope">
            <el-link @click="getDetail(scope.$index)">查看详情</el-link>
          </template>
            
        </el-table-column>
      </el-table>
    </div>


    <el-dialog
        v-model="openDeleteDialog"
        title="确定吗？"
        width="500"
    >
      <span>您确定要删除如下教师吗?</span>
      <p v-for="item in deleteList"> {{ item.name + "(教工号：" + item.username +  ")" }} </p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openDeleteDialog = false">取消</el-button>
          <el-button type="primary" @click="deleteSelection">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="studentInfoDialogVisible" title="详情" style="width: 90%" :append-to-body="true">
      <el-descriptions title="教师信息">
        <el-descriptions-item label="教师索引">{{ teacherInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="教工号">{{ teacherInfo.username }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ teacherInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ teacherInfo.gender }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ teacherInfo.email }}</el-descriptions-item>
      </el-descriptions>

    </el-dialog>

    <el-dialog v-model="addTeacherDialogVisible" title="Shipping address" width="500">
      <el-form :model="addTeacherForm">
        <el-form-item label="教工号" >
          <el-input v-model="addTeacherForm.username" autocomplete="off" />
        </el-form-item>
         <el-form-item label="密码" >
          <el-input type="password" v-model="addTeacherForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" >
          <el-input v-model="addTeacherForm.score" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" >
          <el-select v-model="addTeacherForm.gender" >
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addTeacherDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddTeacher">
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


const teacherData = reactive([])

const search = ref('')
const page = ref(1)
const scrollHeight = ref(1);
const tableRef = ref()
const teacherInfo = reactive({})
const addTeacherForm = reactive({
  username: "",
  password: "",
  name: "",
  gender: "男",
})


function load() {
  get('/admin/teachers/' + (page.value + 1) + "?search=" + search.value,
      (data) => {
        if(data.length !== 0) {
          page.value = page.value +  1
        }
        for (const item of data) {
          teacherData.push({
            id: item.id,
            username: item.account.username,
            name: item.name,
            gender: item.gender,
          })
        }
      })
}

const addTeacherDialogVisible = ref(false)
function openAddTeacherDialog() {
  addTeacherDialogVisible.value = true
}

function submitAddTeacher() {
  console.log(addTeacherForm);
  post("/admin/add-teacher", addTeacherForm,
  (data, message) => {
    ElMessage.success(message)
    getData(search.value)
  })
}

const studentInfoDialogVisible = ref(false)
const fullscreenLoading = ref(false)

function openFullscreenLoading() {
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 3000);
}

function getDetail(index) {
  openFullscreenLoading()
  
  get("/admin/search-teacher/" + teacherData[index].id, (data) => {
    teacherInfo.username = data.account.username
    teacherInfo.email = data.account.email ? data.account.email : "未设置"
    teacherInfo.name = data.name
    teacherInfo.gender = data.gender
    teacherInfo.id = data.id

    studentInfoDialogVisible.value = true
    fullscreenLoading.value = false

  })
}

function reset() {
  getData('')
  tableRef.value.clearSelection()
  
}



function getData(search) {
  teacherData.length = 0
  for (let i = 1; i <= page.value; i++) {
    get('/admin/teachers/' + i + "?search=" + search,
  (data) => {
    
    for(const item of data) {
      teacherData.push({
        id: item.id,
        username: item.account.username,
        name: item.name,
        gender: item.gender,
      })
    }
  })
}
  
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
    ElMessage.warning("您还没有选择任何教师")
    return 
  }
  deleteList.forEach(element => {
    let index = teacherData.indexOf(element)
    if (index !== -1) {
      teacherData.splice(index, 1);
      get("/admin/delete-teacher/" + element.id, () => {
        ElMessage.success("删除教师" + element.name)
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



