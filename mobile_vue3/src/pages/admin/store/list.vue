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
import { getStoreList, createStore, updateStore, deleteStore, updateStoreStatus } from '@/api/admin/store'

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

// 获取数据
const getData = async (p = null) => {
  if (typeof p === 'number') {
    currentPage.value = p
  }
  
  loading.value = true
  
  try {
    const res = await getStoreList(currentPage.value, limit.value, searchForm.keyword)
    
    if (res.code === 0) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取门店列表失败')
    }
  } catch (error) {
    console.error('获取门店列表失败:', error)
    ElMessage.warning('获取门店列表失败')
  } finally {
    loading.value = false
  }
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
    if (key in row) {
      form[key] = row[key]
    }
  })
}

// 处理状态切换
const handleStatusChange = async (row) => {
  loading.value = true
  
  try {
    const res = await updateStoreStatus(row.id, row.status ? 0 : 1)
    
    if (res.code === 0) {
      ElMessage.success(row.status ? '门店已禁用' : '门店已启用')
      getData(currentPage.value)
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('更新门店状态失败:', error)
    ElMessage.warning('更新门店状态失败')
  } finally {
    loading.value = false
  }
}

// 处理删除
const handleDelete = async (id) => {
  loading.value = true
  
  try {
    const res = await deleteStore(id)
    
    if (res.code === 0) {
      ElMessage.success('删除成功')
      
      // 如果当前页只有一条数据，则回到上一页
      if (tableData.value.length === 1 && currentPage.value > 1) {
        getData(currentPage.value - 1)
      } else {
        getData(currentPage.value)
      }
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    console.error('删除门店失败:', error)
    ElMessage.warning('删除门店失败')
  } finally {
    loading.value = false
  }
}

// 表单提交
const handleSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitLoading.value = true
    
    try {
      let res
      if (currentId.value === 0) {
        // 新增
        res = await createStore(form)
      } else {
        // 编辑
        res = await updateStore(currentId.value, form)
      }
      
      if (res.code === 0) {
        ElMessage.success(currentId.value === 0 ? '新增成功' : '更新成功')
        dialogVisible.value = false
        getData(currentPage.value)
      } else {
        ElMessage.error(res.msg || (currentId.value === 0 ? '新增失败' : '更新失败'))
      }
    } catch (error) {
      console.error(currentId.value === 0 ? '新增门店失败' : '更新门店失败', error)
      ElMessage.warning(currentId.value === 0 ? '新增门店失败' : '更新门店失败')
    } finally {
      submitLoading.value = false
    }
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