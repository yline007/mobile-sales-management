<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" @click="handleCreate" :loading="loading">新增手机型号</el-button>
        <div class="flex items-center">
          <el-input v-model="searchForm.keyword" placeholder="型号名称/品牌" class="w-48 mr-2" clearable></el-input>
          <el-select v-model="searchForm.brand" placeholder="选择品牌" clearable class="mr-2">
            <el-option v-for="item in brandOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-button type="primary" @click="getData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="品牌" prop="brand" width="200"></el-table-column>
        <el-table-column label="型号名称" prop="name"></el-table-column>
        <el-table-column label="参考价格" prop="price" width="200">
          <template #default="scope">
            {{ scope.row.price ? '¥' + scope.row.price : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '在售' : '停售' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <div class="flex space-x-2">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button :type="scope.row.status ? 'danger' : 'success'" size="small" @click="handleStatusChange(scope.row)">
                {{ scope.row.status ? '停售' : '在售' }}
              </el-button>
              <el-popconfirm title="是否要删除该型号？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(scope.row.id)">
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
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="form.brand" placeholder="请选择品牌" class="w-full" filterable allow-create>
            <el-option v-for="item in brandOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入型号名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="参考价格" prop="price">
          <el-input v-model.number="form.price" placeholder="请输入参考价格" type="number" clearable>
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="在售" inactive-text="停售"></el-switch>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入型号描述" rows="3"></el-input>
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
  brand: ''
})

// 品牌选项
const brandOptions = ref([
  'Apple', 
  'Samsung', 
  'HUAWEI', 
  'Xiaomi', 
  'OPPO', 
  'vivo', 
  'realme', 
  'OnePlus', 
  'Honor',
  'Google'
])

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.brand = ''
  getData()
}

// 表单相关
const dialogVisible = ref(false)
const submitLoading = ref(false)
const dialogTitle = ref('新增手机型号')
const formRef = ref(null)
const currentId = ref(0)

const form = reactive({
  brand: '',
  name: '',
  price: '',
  status: 1,
  description: ''
})

const rules = {
  brand: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  name: [{ required: true, message: '请输入型号名称', trigger: 'blur' }],
  price: [
    { type: 'number', message: '价格必须为数字', trigger: 'blur' }
  ]
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
    const mockData = [
      { id: 1, brand: 'Apple', name: 'iPhone 15', price: 5999, status: 1, createTime: '2023-10-15 12:00:00', description: '最新款iPhone' },
      { id: 2, brand: 'Apple', name: 'iPhone 14', price: 4999, status: 1, createTime: '2022-09-10 12:00:00', description: '' },
      { id: 3, brand: 'Apple', name: 'iPhone 13', price: 3999, status: 1, createTime: '2021-09-15 12:00:00', description: '' },
      { id: 4, brand: 'Samsung', name: 'Galaxy S23', price: 6299, status: 1, createTime: '2023-02-10 12:00:00', description: '三星旗舰' },
      { id: 5, brand: 'HUAWEI', name: 'P60 Pro', price: 6988, status: 1, createTime: '2023-03-25 12:00:00', description: '华为旗舰' },
      { id: 6, brand: 'HUAWEI', name: 'Mate 50', price: 5999, status: 1, createTime: '2022-09-10 12:00:00', description: '' },
      { id: 7, brand: 'Xiaomi', name: 'MI 13', price: 3999, status: 1, createTime: '2022-12-15 12:00:00', description: '' },
      { id: 8, brand: 'Xiaomi', name: 'MI 14', price: 4599, status: 1, createTime: '2023-10-30 12:00:00', description: '小米最新旗舰' },
      { id: 9, brand: 'OPPO', name: 'Find X6', price: 5999, status: 1, createTime: '2023-03-22 12:00:00', description: '' },
      { id: 10, brand: 'vivo', name: 'X100', price: 4999, status: 1, createTime: '2023-11-17 12:00:00', description: '' },
      { id: 11, brand: 'Honor', name: 'Magic 5', price: 4299, status: 1, createTime: '2023-02-28 12:00:00', description: '' },
      { id: 12, brand: 'OnePlus', name: 'OnePlus 11', price: 3999, status: 1, createTime: '2023-01-10 12:00:00', description: '' },
      { id: 13, brand: 'Google', name: 'Pixel 7', price: 4999, status: 0, createTime: '2022-10-15 12:00:00', description: '' },
      { id: 14, brand: 'Google', name: 'Pixel 8', price: 5999, status: 1, createTime: '2023-10-05 12:00:00', description: '' },
      { id: 15, brand: 'realme', name: 'GT Neo 5', price: 2999, status: 1, createTime: '2023-02-10 12:00:00', description: '' }
    ]
    
    // 搜索过滤
    let filteredData = [...mockData]
    if (searchForm.keyword) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchForm.keyword.toLowerCase()) || 
        item.brand.toLowerCase().includes(searchForm.keyword.toLowerCase())
      )
    }
    
    if (searchForm.brand) {
      filteredData = filteredData.filter(item => item.brand === searchForm.brand)
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
  dialogTitle.value = '新增手机型号'
  dialogVisible.value = true
  currentId.value = 0
  
  // 重置表单
  Object.keys(form).forEach(key => {
    form[key] = key === 'status' ? 1 : ''
  })
}

// 处理编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑手机型号'
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
    ElMessage.success(`已将该型号状态设置为${row.status ? '在售' : '停售'}`)
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
          Object.keys(form).forEach(key => {
            tableData.value[index][key] = form[key]
          })
        }
        ElMessage.success('修改成功')
      }
      
      submitLoading.value = false
      dialogVisible.value = false
      getData()
      
      // 如果是新增品牌，添加到品牌选项
      if (!brandOptions.value.includes(form.brand)) {
        brandOptions.value.push(form.brand)
      }
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