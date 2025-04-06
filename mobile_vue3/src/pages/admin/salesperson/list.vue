<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <div></div>
        <div class="flex items-center">
          <el-input v-model="searchForm.keyword" placeholder="姓名/手机号" class="w-48 mr-2" clearable></el-input>
          <el-select v-model="searchForm.storeId" placeholder="选择门店" clearable class="mr-2">
            <el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-button type="primary" @click="getData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="所属门店" prop="storeName"></el-table-column>
        <el-table-column label="入职时间" prop="joinDate" width="120"></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="160"></el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <div class="flex space-x-2">
              <el-button :type="scope.row.status ? 'danger' : 'success'" size="small" @click="handleStatusChange(scope.row)">
                {{ scope.row.status ? '禁用' : '启用' }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex items-center justify-center mt-5">
        <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  storeId: ''
})

// 门店选项
const storeOptions = ref([
  { id: 1, name: '总店' },
  { id: 2, name: '北京店' },
  { id: 3, name: '上海店' },
  { id: 4, name: '广州店' }
])

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.storeId = ''
  getData()
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 模拟获取数据
const getData = (p = null) => {
  if (typeof p === 'number') {
    currentPage.value = p
  }
  
  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    const mockData = Array.from({ length: 30 }).map((_, index) => {
      const id = index + 1
      const storeIndex = Math.floor(Math.random() * storeOptions.value.length)
      
      // 生成随机日期（过去5年内）
      const now = new Date()
      const pastDate = new Date(now.getFullYear() - Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      
      return {
        id,
        name: `销售员${id}`,
        phone: `1${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
        storeId: storeOptions.value[storeIndex].id,
        storeName: storeOptions.value[storeIndex].name,
        joinDate: formatDate(pastDate),
        status: Math.random() > 0.15 ? 1 : 0,
        createTime: new Date().toLocaleString(),
        remark: Math.random() > 0.7 ? '表现优秀' : ''
      }
    })
    
    // 搜索过滤
    let filteredData = [...mockData]
    if (searchForm.keyword) {
      filteredData = filteredData.filter(item => 
        item.name.includes(searchForm.keyword) || 
        item.phone.includes(searchForm.keyword)
      )
    }
    
    if (searchForm.storeId) {
      filteredData = filteredData.filter(item => item.storeId === searchForm.storeId)
    }
    
    total.value = filteredData.length
    
    // 模拟分页
    const start = (currentPage.value - 1) * limit.value
    const end = start + limit.value
    tableData.value = filteredData.slice(start, end)
    
    loading.value = false
  }, 500)
}

// 处理状态切换
const handleStatusChange = (row) => {
  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    row.status = row.status ? 0 : 1
    ElMessage.success(`已将该销售员状态设置为${row.status ? '启用' : '禁用'}`)
    loading.value = false
  }, 500)
}

// 生命周期
onMounted(() => {
  getData()
})
</script>

<style scoped>
/* 可以添加你的自定义样式 */
</style> 