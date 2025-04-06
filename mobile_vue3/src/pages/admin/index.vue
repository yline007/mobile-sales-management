<template>
    <div>
        <!-- 顶部统计卡片 -->
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card shadow="hover" class="border-0 rounded-lg h-32">
                    <div class="flex items-center">
                        <div class="mr-4">
                            <div class="bg-[#FFF0F0] rounded-full w-14 h-14 flex items-center justify-center">
                                <el-icon class="text-[#FF6B6B] text-2xl">
                                    <Cellphone />
                                </el-icon>
                            </div>
                        </div>
                        <div>
                            <div class="text-gray-400 text-base mb-2">今日销量</div>
                            <CountTo :value="todaySalesCount" class="text-2xl font-bold text-gray-700"></CountTo>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="border-0 rounded-lg h-32">
                    <div class="flex items-center">
                        <div class="mr-4">
                            <div class="bg-[#FFF5E8] rounded-full w-14 h-14 flex items-center justify-center">
                                <el-icon class="text-[#FF9F43] text-2xl">
                                    <Shop />
                                </el-icon>
                            </div>
                        </div>
                        <div>
                            <div class="text-gray-400 text-base mb-2">门店总数</div>
                            <CountTo :value="storeTotalCount" class="text-2xl font-bold text-gray-700"></CountTo>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="border-0 rounded-lg h-32">
                    <div class="flex items-center">
                        <div class="mr-4">
                            <div class="bg-[#FFF0F6] rounded-full w-14 h-14 flex items-center justify-center">
                                <el-icon class="text-[#FF6B9A] text-2xl">
                                    <User />
                                </el-icon>
                            </div>
                        </div>
                        <div>
                            <div class="text-gray-400 text-base mb-2">销售员</div>
                            <CountTo :value="salespersonTotalCount" class="text-2xl font-bold text-gray-700"></CountTo>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="border-0 rounded-lg h-32">
                    <div class="flex items-center">
                        <div class="mr-4">
                            <div class="bg-[#E5F8ED] rounded-full w-14 h-14 flex items-center justify-center">
                                <el-icon class="text-[#28C76F] text-2xl">
                                    <Money />
                                </el-icon>
                            </div>
                        </div>
                        <div>
                            <div class="text-gray-400 text-base mb-2">月销售额</div>
                            <div class="text-2xl font-bold text-gray-700">¥<CountTo :value="monthSalesAmount"></CountTo></div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 下方统计图表 -->
        <el-row :gutter="20" class="mt-5">
            <el-col :span="12">
                <el-card shadow="hover" class="border-0 rounded-lg">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 font-medium">手机品牌销量统计</span>
                        </div>
                    </template>
                    <div id="brandChart" style="height: 300px;"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" class="border-0 rounded-lg">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 font-medium">门店销量统计</span>
                        </div>
                    </template>
                    <div id="storeChart" style="height: 300px;"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import CountTo from '@/components/CountTo.vue'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const todaySalesCount = ref(36)
const storeTotalCount = ref(4)
const salespersonTotalCount = ref(12)
const monthSalesAmount = ref(189650)

// 获取仪表盘数据
const fetchDashboardData = async () => {
    try {
        // 这里可以替换为实际的API调用
        // const res = await getDashboardStatistics()
        // if (res.success) {
        //     todaySalesCount.value = res.data.todaySalesCount
        //     storeTotalCount.value = res.data.storeTotalCount
        //     salespersonTotalCount.value = res.data.salespersonTotalCount
        //     monthSalesAmount.value = res.data.monthSalesAmount
        // }
        
        // 使用模拟数据
        todaySalesCount.value = 36
        storeTotalCount.value = 4
        salespersonTotalCount.value = 12
        monthSalesAmount.value = 189650
    } catch (error) {
        console.error('获取仪表盘数据失败:', error)
        ElMessage.warning({
            message: '获取仪表盘数据失败，已使用模拟数据',
            type: 'warning'
        })
    }
}

// 初始化品牌销量图表
const initBrandChart = () => {
    const brandChart = echarts.init(document.getElementById('brandChart'))
    
    // 模拟数据
    const brandData = [
        { value: 35, name: 'Apple' },
        { value: 25, name: 'HUAWEI' },
        { value: 18, name: 'Xiaomi' },
        { value: 15, name: 'OPPO' },
        { value: 12, name: 'vivo' },
        { value: 6, name: '其他' }
    ]
    
    brandChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center'
        },
        series: [
            {
                name: '品牌销量',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: brandData
            }
        ]
    })
}

// 初始化门店销量图表
const initStoreChart = () => {
    const storeChart = echarts.init(document.getElementById('storeChart'))
    
    // 模拟数据
    const storeNames = ['总店', '北京店', '上海店', '广州店']
    const storeData = [48, 32, 35, 25]
    
    storeChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: storeNames
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '销售量',
                type: 'bar',
                data: storeData,
                itemStyle: {
                    color: function(params) {
                        const colorList = ['#409EFF', '#FF9F43', '#28C76F', '#FF6B9A']
                        return colorList[params.dataIndex % colorList.length]
                    }
                }
            }
        ]
    })
}

onMounted(() => {
    // 获取仪表盘数据
    fetchDashboardData()
    
    // 初始化图表
    initBrandChart()
    initStoreChart()
    
    // 监听窗口大小变化，重新渲染图表
    window.addEventListener('resize', () => {
        const brandChart = echarts.getInstanceByDom(document.getElementById('brandChart'))
        const storeChart = echarts.getInstanceByDom(document.getElementById('storeChart'))
        
        if (brandChart) brandChart.resize()
        if (storeChart) storeChart.resize()
    })
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>


