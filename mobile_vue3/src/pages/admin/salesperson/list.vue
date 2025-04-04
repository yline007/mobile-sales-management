<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" @click="handleCreate" :loading="loading">新增销售员</el-button>
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
              {{ scope.row.status ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="160"></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <div class="flex space-x-2">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button :type="scope.row.status ? 'danger' : 'success'" size="small" @click="handleStatusChange(scope.row)">
                {{ scope.row.status ? '离职' : '在职' }}
              </el-button>
              <el-popconfirm title="是否要删除该销售员？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(scope.row.id)">
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
        <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"></el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" destroy-on-close>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属门店" prop="storeId">
          <el-select v-model="form.storeId" placeholder="请选择门店" class="w-full">
            <el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" prop="joinDate">
          <el-date-picker v-model="form.joinDate" type="date" placeholder="选择入职时间" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="在职" inactive-text="离职"></el-switch>
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

// 表单相关
const dialogVisible = ref(false)
const submitLoading = ref(false)
const dialogTitle = ref('新增销售员')
const formRef = ref(null)
const currentId = ref(0)

const form = reactive({
  name: '',
  phone: '',
  storeId: '',
  joinDate: '',
  status: 1,
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  storeId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  joinDate: [{ required: true, message: '请选择入职时间', trigger: 'change' }]
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

// 处理创建
const handleCreate = () => {
  dialogTitle.value = '新增销售员'
  dialogVisible.value = true
  currentId.value = 0
  
  // 重置表单
  Object.keys(form).forEach(key => {
    form[key] = key === 'status' ? 1 : ''
  })
}

// 处理编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑销售员'
  dialogVisible.value = true
  currentId.value = row.id
  
  // 填充表单
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
}

// 处理状态切换
const handleStatusChange = (row) => {
  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    row.status = row.status ? 0 : 1
    ElMessage.success(`已将该销售员状态设置为${row.status ? '在职' : '离职'}`)
    loading.value = false
  }, 500)
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
        const index = tableData.value.findIndex(item => item.id === currentId.value)
        if (index !== -1) {
          // 获取门店名称
          const store = storeOptions.value.find(s => s.id === form.storeId)
          const storeName = store ? store.name : ''
          
          Object.keys(form).forEach(key => {
            tableData.value[index][key] = form[key]
          })
          
          // 更新门店名称
          tableData.value[index].storeName = storeName
        }
        ElMessage.success('修改成功')
      }
      
      submitLoading.value = false
      dialogVisible.value = false
      getData()
    }, 500)
  })
}

// 生命周期
onMounted(() => {
  getData()
})
</script>

<style scoped>
/* 可以添加你的自定义样式 */
</style> 