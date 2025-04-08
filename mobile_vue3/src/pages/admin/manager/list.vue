<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" @click="handleCreate" :loading="loading">新增管理员</el-button>
        <div class="flex items-center">
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="请输入管理员名称或邮箱" 
            class="mr-2" 
            style="width: 220px;" 
            clearable
          ></el-input>
          <el-button type="primary" @click="getData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="昵称" prop="nickname"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色" prop="role" width="120">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.role === 'super-admin'">超级管理员</el-tag>
            <el-tag v-else>管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="scope.row.statusLoading"
              :disabled="scope.row.role === 'super-admin'"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <div class="flex space-x-2">
              <el-button 
                type="primary" 
                size="small" 
                @click="handleEdit(scope.row)"
                :disabled="scope.row.role === 'super-admin' && scope.row.username === 'admin'"
              >编辑</el-button>
              <el-popconfirm 
                title="是否要删除该管理员？" 
                confirmButtonText="确认" 
                cancelButtonText="取消" 
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button 
                    type="danger" 
                    size="small"
                    :disabled="scope.row.role === 'super-admin' && scope.row.username === 'admin'"
                  >删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex items-center justify-center mt-5">
        <el-pagination 
          background 
          layout="prev,pager,next" 
          :total="total" 
          :current-page="currentPage" 
          :page-size="limit" 
          @current-change="getData"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" destroy-on-close>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="form.id > 0"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item> -->
        <el-form-item label="密码" prop="password" v-if="form.id === 0">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword" v-if="form.id === 0">
          <el-input v-model="form.rePassword" type="password" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option 
              label="超级管理员" 
              value="super-admin" 
              :disabled="form.id > 0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getAdminList, 
  createAdmin, 
  updateAdmin, 
  deleteAdmin, 
  updateAdminStatus 
} from '@/api/admin/user'

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
const dialogTitle = ref('新增管理员')
const formRef = ref(null)

const form = reactive({
  id: 0,
  username: '',
  nickname: '',
  email: '',
  password: '',
  rePassword: '',
  role: 'admin',
  status: 1
})

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else {
    callback()
  }
}

const validateRePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  rePassword: [
    { required: true, validator: validateRePassword, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 获取数据
const getData = (p = null) => {
  if (typeof p === 'number') {
    currentPage.value = p
  }
  
  loading.value = true
  
  getAdminList(currentPage.value, limit.value, searchForm.keyword).then(res => {
    if (res.code === 0) {
      tableData.value = res.data.list.map(item => {
        item.statusLoading = false
        return item
      })
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

// 处理创建
const handleCreate = () => {
  dialogTitle.value = '新增管理员'
  dialogVisible.value = true
  
  // 重置表单
  form.id = 0
  form.username = ''
  form.nickname = ''
  form.email = ''
  form.password = ''
  form.rePassword = ''
  form.role = 'admin'
  form.status = 1
}

// 处理编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑管理员'
  dialogVisible.value = true
  
  // 填充表单
  form.id = row.id
  form.username = row.username
  form.nickname = row.nickname
  form.email = row.email
  form.role = row.role
  form.status = row.status
}

// 处理删除
const handleDelete = (id) => {
  loading.value = true
  
  deleteAdmin(id).then(res => {
    if (res.success) {
      ElMessage.success('删除成功')
      getData()
    } else {
      loading.value = false
      ElMessage.error(res.msg || '删除失败')
    }
  }).catch(() => {
    loading.value = false
  })
}

// 处理状态变更
const handleStatusChange = (row) => {
  row.statusLoading = true
  
  updateAdminStatus(row.id, row.status).then(res => {
    if (res.code === 0) {
      ElMessage.success('状态更新成功')
    } else {
      ElMessage.error(res.msg || '状态更新失败')
      row.status = row.status === 1 ? 0 : 1
    }
    row.statusLoading = false
  }).catch(() => {
    row.status = row.status === 1 ? 0 : 1
    row.statusLoading = false
  })
}

// 处理表单提交
const handleSubmit = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (!valid) return
    
    submitLoading.value = true
    
    // 提交前处理数据
    const submitData = { ...form }
    
    // 编辑时不需要提交密码
    if (form.id > 0) {
      delete submitData.password
      delete submitData.rePassword
    }
    
    const request = form.id === 0 
      ? createAdmin(submitData)
      : updateAdmin(form.id, submitData)
    
    request.then(res => {
      if (res.code === 0) {
        ElMessage.success(form.id === 0 ? '添加成功' : '修改成功')
        dialogVisible.value = false
        getData()
      } else {
        ElMessage.error(res.msg || (form.id === 0 ? '添加失败' : '修改失败'))
      }
      submitLoading.value = false
    }).catch(() => {
      submitLoading.value = false
    })
  })
}

// 生命周期
onMounted(() => {
  getData()
})
</script>

<style scoped>
/* 自定义样式 */
</style> 