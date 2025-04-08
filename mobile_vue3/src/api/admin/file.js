import axios from "@/axios"

/**
 * 上传图片
 * @param {FormData} formData - 包含图片文件的FormData对象
 */
export function uploadImage(formData) {
    return axios.post('/admin/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export default {
    uploadImage
}

