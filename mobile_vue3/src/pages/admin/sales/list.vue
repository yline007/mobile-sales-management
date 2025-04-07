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
        <el-table-column label="门店" prop="storeName"></el-table-column>
        <el-table-column label="销售人员" prop="salesperson"></el-table-column>
        <el-table-column label="手机品牌" prop="phoneBrand"></el-table-column>
        <el-table-column label="手机型号" prop="phoneModel" width="160"></el-table-column>
        <el-table-column label="串码" prop="imei" width="200"></el-table-column>
        <el-table-column label="客户姓名" prop="customerName"></el-table-column>
        <el-table-column label="客户电话" prop="customerPhone"></el-table-column>
        <el-table-column label="销售时间" prop="createTime" width="160"></el-table-column>
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

    <!-- 查看对话框 -->
    <el-dialog title="查看销售记录详情" v-model="viewDialogVisible" width="700px" destroy-on-close>
      <div v-if="currentRow" class="flex flex-col">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div class="text-gray-500 mb-1">门店:</div>
            <div>{{ currentRow.storeName }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">销售人员:</div>
            <div>{{ currentRow.salesperson }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">手机品牌:</div>
            <div>{{ currentRow.phoneBrand }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">手机型号:</div>
            <div>{{ currentRow.phoneModel }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">串码:</div>
            <div>{{ currentRow.imei }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">客户姓名:</div>
            <div>{{ currentRow.customerName }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">客户电话:</div>
            <div>{{ currentRow.customerPhone }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">销售时间:</div>
            <div>{{ currentRow.createTime }}</div>
          </div>
        </div>
        
        <!-- 照片和备注部分使用卡片式布局，更加突出显示 -->
        <el-divider content-position="center">附加信息</el-divider>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <!-- 手机照片卡片 -->
          <el-card v-if="currentRow.photoUrl" shadow="hover" class="mb-4">
            <template #header>
              <div class="font-medium text-gray-700">
                <el-icon class="mr-1"><Picture /></el-icon>
                手机照片
              </div>
            </template>
            <div class="flex justify-center">
              <el-image 
                :src="currentRow.photoUrl" 
                fit="cover"
                class="max-w-full" 
                :preview-src-list="[currentRow.photoUrl]"
                :initial-index="0"
                preview-teleported>
              </el-image>
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
            <div class="p-2 whitespace-pre-wrap">{{ currentRow.remark }}</div>
          </el-card>
        </div>
        
        <!-- 提示信息 -->
        <div v-if="!currentRow.photoUrl && !currentRow.remark" class="text-center text-gray-500 my-4">
          没有附加信息
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowUp, ArrowDown, Picture, Document } from '@element-plus/icons-vue'

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
const storeOptions = ref([
  { id: 1, name: '总店' },
  { id: 2, name: '北京店' },
  { id: 3, name: '上海店' },
  { id: 4, name: '广州店' }
])

const salespersonOptions = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
])

// 手机品牌选项
const phoneBrandOptions = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'HUAWEI' },
  { id: 3, name: 'Xiaomi' },
  { id: 4, name: 'OPPO' },
  { id: 5, name: 'vivo' },
  { id: 6, name: 'Samsung' }
])

// 手机型号选项，增加brandId字段关联品牌
const phoneModelOptions = ref([
  { id: 1, name: 'iPhone 13', brandId: 1 },
  { id: 2, name: 'iPhone 14', brandId: 1 },
  { id: 3, name: 'iPhone 15', brandId: 1 },
  { id: 4, name: 'HUAWEI P50', brandId: 2 },
  { id: 5, name: 'HUAWEI P60', brandId: 2 },
  { id: 6, name: 'HUAWEI Mate 60', brandId: 2 },
  { id: 7, name: 'Xiaomi 13', brandId: 3 },
  { id: 8, name: 'Xiaomi 14', brandId: 3 },
  { id: 9, name: 'Redmi K60', brandId: 3 },
  { id: 10, name: 'OPPO Find X6', brandId: 4 },
  { id: 11, name: 'OPPO Reno 10', brandId: 4 },
  { id: 12, name: 'vivo X90', brandId: 5 },
  { id: 13, name: 'vivo X100', brandId: 5 },
  { id: 14, name: 'Samsung S23', brandId: 6 },
  { id: 15, name: 'Samsung S24', brandId: 6 }
])

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
      const salespersonIndex = Math.floor(Math.random() * salespersonOptions.value.length)
      const brandIndex = Math.floor(Math.random() * phoneBrandOptions.value.length)
      
      // 获取选定品牌下的所有型号
      const brandModels = phoneModelOptions.value.filter(
        model => model.brandId === phoneBrandOptions.value[brandIndex].id
      )
      
      // 从该品牌的型号中随机选择一个
      const phoneModelIndex = Math.floor(Math.random() * brandModels.length)
      const phoneModel = brandModels[phoneModelIndex]

      return {
        id,
        storeId: storeOptions.value[storeIndex].id,
        storeName: storeOptions.value[storeIndex].name,
        salespersonId: salespersonOptions.value[salespersonIndex].id,
        salesperson: salespersonOptions.value[salespersonIndex].name,
        phoneBrandId: phoneBrandOptions.value[brandIndex].id,
        phoneBrand: phoneBrandOptions.value[brandIndex].name,
        phoneModelId: phoneModel.id,
        phoneModel: phoneModel.name,
        imei: `IMEI${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
        customerName: `客户${id}`,
        customerPhone: `1${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
        createTime: new Date().toLocaleString(),
        remark: Math.random() > 0.5 ? '客户很满意' : '',
        photoUrl: ''
      }
    })

    total.value = mockData.length

    // 模拟分页
    const start = (currentPage.value - 1) * limit.value
    const end = start + limit.value
    tableData.value = mockData.slice(start, end)

    loading.value = false
  }, 500)
}

// 处理查看
const handleView = (row) => {
  currentRow.value = row
  viewDialogVisible.value = true
}

// 生命周期
onMounted(() => {
  getData()
})
</script>

<style scoped>
/* 移除上传相关的样式 */
/* .avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 128px;
  height: 128px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  display: flex;
  justify-content: center;
  align-items: center;
} */
</style>