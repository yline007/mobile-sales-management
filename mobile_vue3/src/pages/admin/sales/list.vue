<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <div></div>
        <div class="flex items-center">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" class="mr-2" clearable></el-input>

          <!-- 将范围选择器替换为两个单独的日期选择器 -->
          <div class="flex items-center mr-2">
            <el-date-picker v-model="searchForm.startDate" type="date" placeholder="开始日期" class="mr-1"
              value-format="YYYY-MM-DD"></el-date-picker>
            <span class="mx-1">至</span>
            <el-date-picker v-model="searchForm.endDate" type="date" placeholder="结束日期"
              value-format="YYYY-MM-DD"></el-date-picker>
          </div>
          <el-button type="primary" @click="getData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="门店" prop="store"></el-table-column>
        <el-table-column label="销售人员" prop="salesperson"></el-table-column>
        <el-table-column label="手机品牌" prop="phone_brand" width="100"></el-table-column>
        <el-table-column label="手机型号" prop="phone_model" width="160"></el-table-column>
        <el-table-column label="串码" prop="imei" width="200"></el-table-column>
        <el-table-column label="客户姓名" prop="customer_name"></el-table-column>
        <el-table-column label="客户电话" prop="customer_phone"></el-table-column>
        <el-table-column label="销售时间" prop="create_time" width="180"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <div class="flex space-x-2">
              <el-button type="info" size="small" @click="handleView(scope.row)">查看</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex items-center justify-center mt-5">
        <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
          @current-change="getData"></el-pagination>
      </div>
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="销售记录详情"
      width="800px"
      destroy-on-close
      @closed="currentRow = null"
    >
      <div v-if="currentRow" class="sale-detail">
        <!-- 基本信息卡片 -->
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="font-medium text-gray-700">
              <el-icon class="mr-1"><InfoFilled /></el-icon>
              基本信息
            </div>
          </template>
          <div class="grid grid-cols-2 gap-4">
            <div class="info-item">
              <span class="label">门店：</span>
              <span class="value">{{ currentRow.store }}</span>
            </div>
            <div class="info-item">
              <span class="label">销售员：</span>
              <span class="value">{{ currentRow.salesperson }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机品牌：</span>
              <span class="value">{{ currentRow.phone_brand }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机型号：</span>
              <span class="value">{{ currentRow.phone_model }}</span>
            </div>
            <div class="info-item">
              <span class="label">IMEI：</span>
              <span class="value">{{ currentRow.imei }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间：</span>
              <span class="value">{{ currentRow.create_time }}</span>
            </div>
            <div class="info-item">
              <span class="label">客户姓名：</span>
              <span class="value">{{ currentRow.customer_name }}</span>
            </div>
            <div class="info-item">
              <span class="label">客户电话：</span>
              <span class="value">{{ currentRow.customer_phone }}</span>
            </div>
          </div>
        </el-card>

        <!-- 图片和备注区域 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 手机照片卡片 -->
          <el-card v-if="currentRow.photo_url && currentRow.photo_url.length > 0" shadow="hover" class="mb-4">
            <template #header>
              <div class="font-medium text-gray-700">
                <el-icon class="mr-1"><Picture /></el-icon>
                手机照片 ({{ currentRow.photo_url.length }}张)
              </div>
            </template>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(url, index) in currentRow.photo_url" :key="index" class="relative">
                <el-image 
                  :src="url" 
                  fit="cover"
                  class="w-full h-48 object-cover rounded-lg cursor-pointer" 
                  :preview-src-list="currentRow.photo_url"
                  :initial-index="index"
                  preview-teleported>
                  <template #error>
                    <div class="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <el-icon class="text-gray-400 text-3xl"><Picture-Filled /></el-icon>
                    </div>
                  </template>
                </el-image>
                <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {{ index + 1 }}/{{ currentRow.photo_url.length }}
                </div>
              </div>
            </div>
          </el-card>
          
          <!-- 备注卡片 -->
          <el-card v-if="currentRow.remark" shadow="hover" class="mb-4">
            <template #header>
              <div class="font-medium text-gray-700">
                <el-icon class="mr-1"><Document /></el-icon>
                备注信息
              </div>
            </template>
            <div class="p-2 whitespace-pre-wrap">{{ currentRow.remark || '无' }}</div>
          </el-card>
        </div>
        
        <!-- 提示信息 -->
        <div v-if="(!currentRow.photo_url || currentRow.photo_url.length === 0) && !currentRow.remark" class="text-center text-gray-500 my-4">
          没有附加信息
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Picture, 
  Document, 
  PictureFilled,
  InfoFilled 
} from '@element-plus/icons-vue'
import { getSalesList, getSalesDetail } from '@/api/admin/sales'
import { getStoreList } from '@/api/admin/store'

// 控制搜索表单的显示与隐藏
const showSearchForm = ref(true)

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  storeId: '',
  startDate: '',
  endDate: ''
})

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.storeId = ''
  searchForm.startDate = ''
  searchForm.endDate = ''
  getData()
}

// 表单相关
const viewDialogVisible = ref(false)
const currentRow = ref(null)

// 模拟数据
const storeOptions = ref([])

// 获取门店列表
const fetchStoreOptions = async () => {
  try {
    const res = await getStoreList(1, 100)
    if (res.code === 0 && res.data && res.data.list) {
      // 转换门店数据格式
      storeOptions.value = res.data.list.map(item => ({
        id: item.id,
        name: item.store  // 使用 store 字段作为名称
      }))
    }
  } catch (error) {
    console.error('获取门店列表失败:', error)
    ElMessage.error('获取门店列表失败')
  }
}

// 获取数据
const getData = async (p = null) => {
  if (typeof p === 'number') {
    currentPage.value = p
  }

  loading.value = true

  try {
    const res = await getSalesList(currentPage.value, limit.value, {
      keyword: searchForm.keyword,
      store: searchForm.storeId || null,  // 修改为 store
      start_date: searchForm.startDate || null,
      end_date: searchForm.endDate || null
    })

    if (res.code === 0) {
      // 直接使用返回的数据，不需要转换字段名
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取销售记录失败')
    }
  } catch (error) {
    console.error('获取销售记录失败:', error)
    ElMessage.error('获取销售记录列表失败')
  } finally {
    loading.value = false
  }
}

// 处理查看
const handleView = async (row) => {
  try {
    loading.value = true
    const res = await getSalesDetail(row.id)
    if (res.code === 0) {
      // 直接使用返回的数据，不需要转换字段名
      currentRow.value = res.data
      viewDialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取销售记录详情失败')
    }
  } catch (error) {
    console.error('获取销售记录详情失败:', error)
    ElMessage.error('获取销售记录详情失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(async () => {
  // await fetchStoreOptions()
  getData()
  
  // 添加全局事件监听，用于接收来自其他页面的刷新指令
  window.addEventListener('reload-sales-data', handleReloadData)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('reload-sales-data', handleReloadData)
})

// 处理数据刷新
const handleReloadData = () => {
  console.log('收到刷新销售数据指令')
  // 重置到第一页并刷新数据
  currentPage.value = 1
  getData()
}

// 提供给外部调用的刷新方法
const refreshSalesData = () => {
  getData()
}

// 暴露方法供父组件调用
defineExpose({
  refreshSalesData
})
</script>

<style scoped>
.sale-detail {
  .info-item {
    @apply flex items-center mb-2;
    
    .label {
      @apply text-gray-500 w-24;
    }
    
    .value {
      @apply text-gray-800 flex-1;
    }
  }
}
</style>