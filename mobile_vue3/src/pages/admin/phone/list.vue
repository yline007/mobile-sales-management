<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 头部搜索 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" @click="handleCreate" :loading="loading">新增手机型号</el-button>
        <div class="flex items-center">
          <el-input v-model="searchForm.keyword" placeholder="型号名称/品牌" class="w-48 mr-2" clearable></el-input>
          <el-select v-model="searchForm.brand" placeholder="选择品牌" clearable class="mr-2">
            <el-option 
                v-for="item in brandOptions" 
                :key="item.id" 
                :label="item.name" 
                :value="item.name">
            </el-option>
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
        <el-form-item label="品牌" prop="brand_id">
          <el-select 
              v-model="form.brand_id" 
              placeholder="请选择品牌" 
              class="w-full" 
              filterable
              @change="handleBrandChange">
              <el-option 
                  v-for="item in brandOptions" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
              </el-option>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    getPhoneBrandList, 
    getPhoneModelList, 
    createPhoneModel,
    deletePhoneModel,
    updatePhoneModelStatus,
    updatePhoneModel
} from '@/api/admin/phone'

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
const brandOptions = ref([])

// 获取品牌列表
const fetchBrandOptions = async () => {
    try {
        const res = await getPhoneBrandList(1, 100) // 获取足够多的品牌数据
        if (res.code === 0 && res.data && res.data.list) {
            // 修改数据结构，保存品牌ID和名称
            brandOptions.value = res.data.list.map(item => ({
                id: item.id,
                name: item.name
            }))
        } else {
            console.warn('获取品牌列表失败')
            ElMessage.warning('获取品牌列表失败')
        }
    } catch (error) {
        console.error('获取品牌列表失败:', error)
        ElMessage.error('获取品牌列表失败')
    }
}

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
    brand_id: '', // 改为 brand_id
    brand_name: '', // 添加 brand_name 字段用于显示
    name: '',
    price: '',
    status: 1,
    description: ''
})

const rules = {
    brand_id: [{ required: true, message: '请选择品牌', trigger: 'change' }],
    name: [{ required: true, message: '请输入型号名称', trigger: 'blur' }],
    price: [
        { type: 'number', message: '价格必须为数字', trigger: 'blur' }
    ]
}

// 获取数据
const getData = async (p = null) => {
  if (typeof p === 'number') {
    currentPage.value = p
  }
  
  loading.value = true
  
  try {
    const res = await getPhoneModelList(
      currentPage.value,
      limit.value,
      searchForm.keyword,
      searchForm.brand ? brandOptions.value.find(b => b.name === searchForm.brand)?.id : null
    )

    if (res.code === 0 && res.data) {
      tableData.value = res.data.list.map(item => ({
        id: item.id,
        brand: item.brand_name,
        name: item.name,
        price: item.price,
        status: item.status,
        createTime: item.create_time,
        description: item.description || ''
      }))
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取手机型号列表失败:', error)
    ElMessage.error('获取手机型号列表失败')
  } finally {
    loading.value = false
  }
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
  
  // 查找对应的品牌ID
  const brand = brandOptions.value.find(b => b.name === row.brand)
  
  // 填充表单
  form.brand_id = brand ? brand.id : ''
  form.brand_name = row.brand
  form.name = row.name
  form.price = row.price
  form.status = row.status
  form.description = row.description || ''
}

// 处理状态切换
const handleStatusChange = async (row) => {
    try {
        const newStatus = row.status ? 0 : 1
        const confirmText = newStatus ? '确定要将该型号改为在售状态吗？' : '确定要将该型号改为停售状态吗？'
        
        await ElMessageBox.confirm(confirmText, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        
        loading.value = true
        const res = await updatePhoneModelStatus(row.id, newStatus)
        
        if (res.code === 0) {
            row.status = newStatus // 更新本地状态
            ElMessage.success(`已将该型号状态修改为${newStatus ? '在售' : '停售'}`)
        } else {
            ElMessage.error(res.msg || '状态更新失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('更新手机型号状态失败:', error)
            ElMessage.error('更新手机型号状态失败')
        }
    } finally {
        loading.value = false
    }
}

// 处理删除
const handleDelete = async (id) => {
    loading.value = true
    
    try {
        const res = await deletePhoneModel(id)
        
        if (res.code === 0) {
            ElMessage.success('删除成功')
            // 如果当前页只有一条数据，且不是第一页，则跳转到上一页
            if (tableData.value.length === 1 && currentPage.value > 1) {
                currentPage.value--
            }
            getData() // 重新获取列表数据
        } else {
            ElMessage.error(res.msg || '删除失败')
        }
    } catch (error) {
        console.error('删除手机型号失败:', error)
        ElMessage.error('删除手机型号失败')
    } finally {
        loading.value = false
    }
}

// 处理表单提交
const handleSubmit = async () => {
    if (!formRef.value) return
    
    formRef.value.validate(async (valid) => {
        if (!valid) return
        
        submitLoading.value = true
        
        try {
            // 准备提交的数据
            const submitData = {
                brand_id: form.brand_id,
                name: form.name,
                price: form.price || 0,
                status: form.status,
                description: form.description || ''
            }

            let res
            if (currentId.value === 0) {
                // 新增
                res = await createPhoneModel(submitData)
            } else {
                // 编辑
                res = await updatePhoneModel(currentId.value, submitData)
            }
            
            if (res.code === 0) {
                ElMessage.success(currentId.value === 0 ? '添加成功' : '修改成功')
                dialogVisible.value = false
                getData() // 刷新列表
            } else {
                ElMessage.error(res.msg || (currentId.value === 0 ? '添加失败' : '修改失败'))
            }
        } catch (error) {
            console.error(currentId.value === 0 ? '创建手机型号失败:' : '更新手机型号失败:', error)
            ElMessage.error(currentId.value === 0 ? '创建手机型号失败' : '更新手机型号失败')
        } finally {
            submitLoading.value = false
        }
    })
}

// 处理品牌选择变化
const handleBrandChange = (brandId) => {
    const brand = brandOptions.value.find(b => b.id === brandId)
    if (brand) {
        form.brand_name = brand.name
    }
}

// 生命周期
onMounted(() => {
  fetchBrandOptions()
  getData()
})
</script>

<style scoped>
/* 可以添加你的自定义样式 */
</style> 