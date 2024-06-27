<template>
  <div class="student-manage" style="height: 100%; padding: 20px;">
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="搜索学号或姓名" style="width: 40%">
          <el-input v-model="search" placeholder="学号姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData(search)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reset">复原</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAddStudentDialog">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteStudent">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height: 100%" ref="scrollRef">

      <el-table :data="studentData" min-height="100px" ref="tableRef" 
        v-el-table-infinite-scroll="load" style="overflow: auto;"
        :height="scrollHeight"
        :v-el-table-infinite-scroll-delay="20000"
        
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="username" label="学号" />
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="age" label="年龄" align="center" width="60px"/>
        <el-table-column prop="gender" label="性别" align="center" width="60px"/>
        <el-table-column prop="className" label="班级"/>
        <el-table-column prop="address" label="住址" show-overflow-tooltip/>
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
      <span>您确定要删除如下学生吗?</span>
      <p v-for="item in deleteList"> {{ item.name + "(学号：" + item.username +  ")" }} </p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openDeleteDialog = false">取消</el-button>
          <el-button type="primary" @click="deleteSelection">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="studentInfoDialogVisable" title="详情" style="width: 90%" :append-to-body="true">
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
      </el-descriptions> 
        <el-table :data="studentInfo.scores" style="min-height: 200px; max-height: 300px" ref="tableRef" 
        >
          <el-table-column label="科目"> 
            <template #default="scope" >
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

    </el-dialog>

    <el-dialog v-model="addStudentDialogVisible" title="Shipping address" width="500">
      <el-form :model="addStudentForm">
        <el-form-item label="学号" >
          <el-input v-model="addStudentForm.username" autocomplete="off" />
        </el-form-item>
         <el-form-item label="密码" >
          <el-input type="password" v-model="addStudentForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" >
          <el-input v-model="addStudentForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年龄" >
          <el-input-number v-model="addStudentForm.age" :min="1" :max="100"/>
        </el-form-item>
        <el-form-item label="性别" >
          <el-select v-model="addStudentForm.gender" >
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
           <el-autocomplete
            v-model="addStudentForm.className"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearchAsync"
            placeholder=""
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="住址" >
          <el-input v-model="addStudentForm.address" autocomplete="off" />
        </el-form-item>
        
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addStudentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddStudent">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>


  </div>

</template>


<script setup>
import { ref, reactive, onMounted, watch, toRefs } from 'vue';
import { get, post } from '@/http'


const studentData = reactive([])

const search = ref('')
const page = ref(1)
const scrollHeight = ref(1);
const tableRef = ref()
const studentInfo = reactive({})
const addStudentForm = reactive({
  username: "",
  password: "",
  name: "",
  age: 18,
  gender: "男",
  address: "",
  classId: 1,
  className: ""
})


function load() {
  
  get('/teacher/students/' + (page.value + 1) + "?search=" + search.value, 
  (data, message) => {
    console.log(search.value);
    if(data.length !== 0) {
      page.value = page.value +  1
    }
    for(const item of data) {
      studentData.push({
        id: item.id,
        username: item.account.username,
        name: item.name,
        age: item.age,
        gender: item.gender,
        className: item.clazz.name,
        address: item.address,
      })
    }
  })
}

const addStudentDialogVisible = ref(false)
function openAddStudentDialog() {
  addStudentDialogVisible.value = true
}

function submitAddStudent() {
  console.log(addStudentForm);
  post("/admin/add-student", addStudentForm,
  (data, message) => {
    ElMessage.success(message)
    getData(search.value)
  })
}
function handleSelect(data) {
  addStudentForm.classId = data.id
}
const querySearchAsync = (queryString, cb) => {
  
  addStudentForm.classId = '';
  get("/student/searchClass/" + addStudentForm.className, (data, message) => {
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
const studentInfoDialogVisable = ref(false)
const fullscreenLoading = ref(false)

function openFullscreenLoading() {
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 3000);
}

function getDetail(index) {
  openFullscreenLoading()
  
  get("/teacher/student/" + studentData[index].id, (data, message) => {
    

    studentInfo.address = data.address
    studentInfo.username = data.account.username
    studentInfo.email = data.account.email ? data.account.email : "未设置"
    studentInfo.name = data.name
    studentInfo.age = data.age
    studentInfo.gender = data.gender
    studentInfo.className = data.clazz.name
    studentInfo.id = data.id
    studentInfo.scores = data.scores

    studentInfoDialogVisable.value = true
    fullscreenLoading.value = false

  })
}

function reset() {
  getData('')
  tableRef.value.clearSelection()
  
}



function getData(search) {
  studentData.length = 0
  for (let i = 1; i <= page.value; i++) {
    get('/teacher/students/' + i + "?search=" + search, 
  (data, message) => {
    
    for(const item of data) {
      studentData.push({
        id: item.id,
        username: item.account.username,
        name: item.name,
        age: item.age,
        gender: item.gender,
        className: item.clazz.name,
        address: item.address,
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
    ElMessage.warning("您还没有选择任何学生")
    return 
  }
  openDeleteDialog.value = true

}

function deleteSelection() {
  openDeleteDialog.value = false
  if (deleteList.length === 0) {
    ElMessage.warning("您还没有选择任何学生")
    return 
  }
  deleteList.forEach(element => {
    console.log(element.id);
    let index = studentData.indexOf(element)
    if (index !== -1) {
      studentData.splice(index, 1);
      get("/admin/delete-student/" + element.id, (data, message) => {
        ElMessage.success("删除学生" + element.name)
      })
    }
  })
}

const scrollRef = ref()
const resizeObserver = new ResizeObserver(entries => {
  
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



