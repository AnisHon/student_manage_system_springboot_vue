<template>
  <div class="student-scores" style="height: 100%; padding: 20px;">
    <div>
      <el-form :inline="true">
        <el-form-item label="搜索查询" style="width: 40%">
          <el-input v-model="search" placeholder="科目" clearable/>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="submitSearch(search)">查询</el-button>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="reset">复原</el-button>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="openAddTeacherDialog">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteStudent">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height: 100%" ref="scrollRef">

      <el-table :data="subjectData" min-height="100px" ref="tableRef"
                v-el-table-infinite-scroll="load" style="overflow: auto;"
                :height="scrollHeight"
                :v-el-table-infinite-scroll-delay="20000"

      >
        <el-table-column type="selection" width="30px"/>
        <el-table-column prop="id" label="ID"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="scope">
            <el-link @click="changeScore(scope.$index)">修改</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog
        v-model="openDeleteDialog"
        title="确定吗？"
        width="500"
    >
      <span>您确定要删除如下科目吗？</span>
      <p v-for="item in deleteList"> {{ item.name + "(ID：" + item.id +  ")" }} </p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openDeleteDialog = false">取消</el-button>
          <el-button type="primary" @click="deleteSelection">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="addSubjectDialogVisible" title="学科管理" width="500">
      <el-form :model="subjectForm">
        <el-form-item label="ID" >
          <el-input v-model="subjectForm.id" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="学科名称" >
          <el-input v-model="subjectForm.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addSubjectDialogVisible = false">取消</el-button>
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


const subjectData = reactive([])
const order = ref('0')
const search = ref('')
const page = ref(1)
const scrollHeight = ref(1);
const tableRef = ref()
const changeOrAdd = ref(true)
const subjectForm = reactive({
  id: "",
  name: ""
})


function load() {
  get('/student/subjects/' + (page.value + 1) + "?search=" + search.value,
      (data) => {
        if(data.length !== 0) {
          page.value = page.value +  1
        }

        for (const item of data) {

          subjectData.push({
            id: item.id,
            name: item.name,
          })
        }

      })
}

const addSubjectDialogVisible = ref(false)
function openAddTeacherDialog() {

  changeOrAdd.value = false
  addSubjectDialogVisible.value = true
  subjectForm.id = ''
  subjectForm.name = ''

}

function submit() {
  let url = changeOrAdd.value ?  "/admin/change-subject" : "/admin/add-subject"
  post(url, subjectForm,
      (data, message) => {
        ElMessage.success(message)
        getData(search.value)
      })
}



function changeScore(index) {
  console.log(index)
  console.log(subjectData[index])
  subjectForm.id = subjectData[index].id
  subjectForm.name = subjectData[index].name
  changeOrAdd.value = true
  addSubjectDialogVisible.value = true

}

function reset() {
  getData('')
  tableRef.value.clearSelection()
}



function getData(search) {
  subjectData.length = 0
  for (let i = 1; i <= page.value; i++) {
    get('/student/subjects/' + i + "?search=" + search,
        (data) => {

          for(const item of data) {
            subjectData.push({
              id: item.id,
              name: item.name
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
    ElMessage.warning("您还没有选择任何科目")
    return
  }
  deleteList.forEach(element => {
    let index = subjectData.indexOf(element)
    if (index !== -1) {
      subjectData.splice(index, 1);
      get("/admin/delete-subject/" + element.id, () => {
        ElMessage.success("删除了" + element.name)
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



