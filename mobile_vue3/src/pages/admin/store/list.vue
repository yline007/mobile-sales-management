<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" @click="handleCreate" :loading="loading">新增门店</el-button>
        <div class="flex items-center">
          <el-input v-model="searchForm.keyword" placeholder="门店名称" class="w-48 mr-2" clearable></el-input>
          <el-button type="primary" @click="getData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="门店名称" prop="name"></el-table-column>
        <el-table-column label="门店地址" prop="address"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="负责人" prop="manager"></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="160"></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <div class="flex space-x-2">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button :type="scope.row.status ? 'danger' : 'success'" size="small" @click="handleStatusChange(scope.row)">
                {{ scope.row.status ? '禁用' : '启用' }}
              </el-button>
              <el-popconfirm title="是否要删除该门店？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(scope.row.id)">
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
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入门店名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入门店地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="form.manager" placeholder="请输入负责人姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
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
  keyword: ''
})

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  getData()
}

// 表单相关
const dialogVisible = ref(false)
const submitLoading = ref(false)
const dialogTitle = ref('新增门店')
const formRef = ref(null)
const currentId = ref(0)

const form = reactive({
  name: '',
  address: '',
  phone: '',
  manager: '',
  status: 1,
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入门店地址', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '电话格式不正确', trigger: 'blur' }
  ],
  manager: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }]
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
    const mockData = Array.from({ length: 20 }).map((_, index) => {
      const id = index + 1
      
      return {
        id,
        name: `门店${id}`,
        address: `北京市朝阳区xxx街道${id}号`,
        phone: id % 2 === 0 ? `1${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}` : `010-${Math.floor(Math.random() * 10000000)}`,
        manager: `负责人${id}`,
        status: Math.random() > 0.2 ? 1 : 0,
        createTime: new Date().toLocaleString(),
        remark: Math.random() > 0.5 ? '这是一家旗舰店' : ''
      }
    })
    
    // 搜索过滤
    let filteredData = [...mockData]
    if (searchForm.keyword) {
      filteredData = filteredData.filter(item => item.name.includes(searchForm.keyword))
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
  dialogTitle.value = '新增门店'
  dialogVisible.value = true
  currentId.value = 0
  
  // 重置表单
  Object.keys(form).forEach(key => {
    form[key] = key === 'status' ? 1 : ''
  })
}

// 处理编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑门店'
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
    ElMessage.success(`已${row.status ? '启用' : '禁用'}该门店`)
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