<template>
  <div>
    <el-card shadow="never" class="border-0">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold">系统设置</span>
        </div>
      </template>

      <el-form :model="basicForm" ref="basicFormRef" label-width="120px" class="max-w-3xl" :rules="basicRules">
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="basicForm.systemName" placeholder="请输入系统名称"></el-input>
        </el-form-item>
        <el-form-item label="系统Logo">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="basicForm.logo" :src="basicForm.logo" class="w-32 h-32 object-cover" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="text-gray-400 mt-1">建议尺寸: 200px * 200px</div>
        </el-form-item>
        <el-form-item label="管理员电话" prop="adminPhone">
          <el-input v-model="basicForm.adminPhone" placeholder="请输入管理员电话"></el-input>
        </el-form-item>
        <el-form-item label="管理员邮箱" prop="adminEmail">
          <el-input v-model="basicForm.adminEmail" placeholder="请输入管理员邮箱"></el-input>
        </el-form-item>
        <el-form-item label="版权信息" prop="copyright">
          <el-input v-model="basicForm.copyright" placeholder="请输入版权信息"></el-input>
        </el-form-item>
        <el-form-item label="备案信息" prop="icp">
          <el-input v-model="basicForm.icp" placeholder="请输入备案信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveBasic" :loading="basicLoading">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 基础设置
const basicForm = reactive({
  systemName: '手机销售记录管理系统',
  logo: '',
  adminPhone: '13800138000',
  adminEmail: 'admin@example.com',
  copyright: '© 2023 手机销售记录管理系统',
  icp: '京ICP备12345678号-1'
})

const basicFormRef = ref(null)
const basicLoading = ref(false)

const basicRules = {
  systemName: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  adminPhone: [
    { required: true, message: '请输入管理员电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  adminEmail: [
    { required: true, message: '请输入管理员邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// Logo上传
const handleLogoSuccess = (res) => {
  basicForm.logo = res.url || 'https://via.placeholder.com/200'
}

const beforeLogoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传Logo图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传Logo图片大小不能超过 2MB!')
  }
  return (isJPG || isPNG) && isLt2M
}

// 保存基础设置
const saveBasic = () => {
  if (!basicFormRef.value) return
  
  basicFormRef.value.validate((valid) => {
    if (!valid) return
    
    basicLoading.value = true
    
    // 模拟API请求
    setTimeout(() => {
      ElMessage.success('系统设置保存成功')
      basicLoading.value = false
    }, 500)
  })
}

// 生命周期
onMounted(() => {
  // 可以在这里加载初始设置
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
</style> 