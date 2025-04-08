<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <div></div>
        <div class="flex items-center">
          <el-input v-model="searchForm.keyword" placeholder="姓名/手机号" class="w-48 mr-2" clearable></el-input>
          <el-button type="primary" @click="getData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="状态" width="150">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="create_time" width="230"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSalespersonList, updateSalespersonStatus } from '@/api/admin/user'

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
  currentPage.value = 1
  getData()
}

// 获取数据
const getData = async (p = null) => {
  if (typeof p === 'number') {
    currentPage.value = p
  }
  
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: limit.value,
      keyword: searchForm.keyword,
      store_id: searchForm.storeId || undefined
    }

    const res = await getSalespersonList(params)
    if (res.code === 0) {
      tableData.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取销售员列表失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 处理状态切换
const handleStatusChange = async (row) => {
    const newStatus = row.status ? 0 : 1
    const actionText = newStatus ? '启用' : '禁用'
    
    try {
        await ElMessageBox.confirm(
            `确定要${actionText}该销售员吗？`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
        
        loading.value = true
        const res = await updateSalespersonStatus(row.id, newStatus)
        
        if (res.code === 0) {
            row.status = newStatus
            ElMessage.success(`已成功${actionText}该销售员`)
        } else {
            ElMessage.error(res.msg || `${actionText}失败`)
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('修改状态失败:', error)
            ElMessage.error('操作失败，请重试')
        }
    } finally {
        loading.value = false
    }
}

// 生命周期
onMounted(() => {
  getData()
})
</script>

<style scoped>
/* 可以添加你的自定义样式 */
</style> 