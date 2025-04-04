<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" @click="handleCreate" :loading="loading">新增销售记录</el-button>
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
        <el-table-column label="手机型号" prop="phoneModel"></el-table-column>
        <el-table-column label="串码" prop="imei" width="200"></el-table-column>
        <el-table-column label="客户姓名" prop="customerName"></el-table-column>
        <el-table-column label="客户电话" prop="customerPhone"></el-table-column>
        <el-table-column label="销售时间" prop="createTime" width="160"></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <div class="flex space-x-2">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="info" size="small" @click="handleView(scope.row)">查看</el-button>
              <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消"
                @confirm="handleDelete(scope.row.id)">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" destroy-on-close>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
        <el-form-item label="门店" prop="storeId">
          <el-select v-model="form.storeId" placeholder="选择门店" class="w-full">
            <el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售人员" prop="salespersonId">
          <el-select v-model="form.salespersonId" placeholder="选择销售人员" class="w-full">
            <el-option v-for="item in salespersonOptions" :key="item.id" :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机型号" prop="phoneModelId">
          <el-select v-model="form.phoneModelId" placeholder="选择手机型号" class="w-full">
            <el-option v-for="item in phoneModelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="串码" prop="imei">
          <el-input v-model="form.imei" placeholder="请输入手机串码" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户电话" prop="customerPhone">
          <el-input v-model="form.customerPhone" placeholder="请输入客户电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="凭证照片" prop="photoUrl">
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
            :on-success="handleUploadSuccess" :before-upload="beforeUpload">
            <img v-if="form.photoUrl" :src="form.photoUrl" class="w-32 h-32 object-cover" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看对话框 -->
    <el-dialog title="查看销售记录详情" v-model="viewDialogVisible" width="600px" destroy-on-close>
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
        <div v-if="currentRow.photoUrl" class="mb-4">
          <div class="text-gray-500 mb-1">凭证照片:</div>
          <div>
            <img :src="currentRow.photoUrl" class="max-w-md" />
          </div>
        </div>
        <div v-if="currentRow.remark">
          <div class="text-gray-500 mb-1">备注:</div>
          <div>{{ currentRow.remark }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

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
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const submitLoading = ref(false)
const dialogTitle = ref('新增销售记录')
const formRef = ref(null)
const currentId = ref(0)
const currentRow = ref(null)

const form = reactive({
  storeId: '',
  salespersonId: '',
  phoneModelId: '',
  imei: '',
  customerName: '',
  customerPhone: '',
  photoUrl: '',
  remark: ''
})

const rules = {
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  salespersonId: [{ required: true, message: '请选择销售人员', trigger: 'change' }],
  phoneModelId: [{ required: true, message: '请选择手机型号', trigger: 'change' }],
  imei: [{ required: true, message: '请输入手机串码', trigger: 'blur' }],
  customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  customerPhone: [
    { required: true, message: '请输入客户电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

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

const phoneModelOptions = ref([
  { id: 1, name: 'iPhone 13' },
  { id: 2, name: 'iPhone 14' },
  { id: 3, name: 'iPhone 15' },
  { id: 4, name: 'HUAWEI P50' },
  { id: 5, name: 'HUAWEI P60' }
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
      const phoneModelIndex = Math.floor(Math.random() * phoneModelOptions.value.length)

      return {
        id,
        storeId: storeOptions.value[storeIndex].id,
        storeName: storeOptions.value[storeIndex].name,
        salespersonId: salespersonOptions.value[salespersonIndex].id,
        salesperson: salespersonOptions.value[salespersonIndex].name,
        phoneModelId: phoneModelOptions.value[phoneModelIndex].id,
        phoneModel: phoneModelOptions.value[phoneModelIndex].name,
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

// 处理创建
const handleCreate = () => {
  dialogTitle.value = '新增销售记录'
  dialogVisible.value = true
  currentId.value = 0

  // 重置表单
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

// 处理编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑销售记录'
  dialogVisible.value = true
  currentId.value = row.id

  // 填充表单
  Object.keys(form).forEach(key => {
    form[key] = row[key] || ''
  })
}

// 处理查看
const handleView = (row) => {
  currentRow.value = row
  viewDialogVisible.value = true
}

// 处理删除
const handleDelete = (id) => {
  loading.value = true

  // 模拟API请求
  setTimeout(() => {
    tableData.value = tableData.value.filter(item => item.id !== id)
    ElMessage.success('删除成功')
    loading.value = false

    if (tableData.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
      getData()
    }
  }, 500)
}

// 处理表单提交
const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (!valid) return

    submitLoading.value = true

    // 模拟API请求
    setTimeout(() => {
      if (currentId.value === 0) {
        // 新增
        ElMessage.success('添加成功')
      } else {
        // 编辑
        ElMessage.success('修改成功')
      }

      submitLoading.value = false
      dialogVisible.value = false
      getData()
    }, 500)
  })
}

// 上传相关
const handleUploadSuccess = (res) => {
  // 假设上传成功后，服务器返回了图片URL
  form.photoUrl = res.url || 'https://via.placeholder.com/300'
}

const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return (isJPG || isPNG) && isLt2M
}

// 生命周期
onMounted(() => {
  getData()
})
</script>

<style scoped>
.avatar-uploader {
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
}

/* 增加时间选择器样式 */
.date-picker-wider {
  width: 400px !important;
}

.date-picker-wider :deep(.el-input__inner) {
  width: 100% !important;
}

.date-picker-wider :deep(.el-range-editor) {
  width: 100% !important;
}

.date-picker-wider :deep(.el-range-input) {
  width: 45% !important;
}
</style>