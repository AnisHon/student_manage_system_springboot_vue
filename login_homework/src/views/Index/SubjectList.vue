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
      </el-form>
    </div>
    <div style="height: 100%" ref="scrollRef">

      <el-table :data="subjectData" min-height="100px" ref="tableRef"
                v-el-table-infinite-scroll="load" style="overflow: auto;"
                :height="scrollHeight"
                :v-el-table-infinite-scroll-delay="20000"

      >
        <el-table-column prop="id" label="ID"/>
        <el-table-column prop="name" label="名称"/>
      </el-table>
    </div>
  </div>

</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { get } from '@/http'


const subjectData = reactive([])
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

const scrollRef = ref()

onMounted(() => {
  const height = scrollRef.value.clientHeight
  scrollHeight.value = height - 100
  getData("")
})




</script>


<style scoped>

</style>



