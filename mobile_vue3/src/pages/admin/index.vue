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
                            <div class="text-2xl font-bold text-gray-700">¥ <CountTo :value="monthSalesAmount"></CountTo></div>
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
                            <span class="text-gray-600 font-medium">每日销量统计</span>
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
import { ref, onMounted, onUnmounted, onBeforeUnmount, onActivated, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElLoading } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { getDashboardStatistics, getBrandStatistics, getDailySalesStatistics } from '@/api/admin/dashboard'

const router = useRouter()
const route = useRoute()

// 表示页面是否需要刷新数据
const needRefresh = ref(true)

// 统计数据
const todaySalesCount = ref(0)
const storeTotalCount = ref(0)
const salespersonTotalCount = ref(0)
const monthSalesAmount = ref(0)

// 存储图表实例的引用
const brandChart = ref(null)
const storeChart = ref(null)

// 刷新所有数据的函数
const refreshAllData = async () => {
  // 显示加载状态
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '刷新数据中...',
    background: 'rgba(255, 255, 255, 0.7)'
  })
  
  try {
    // 并行获取所有数据
    await Promise.all([
      fetchDashboardData(),
      initBrandChart(),
      initStoreChart()
    ])
    
    // 刷新完成
    needRefresh.value = false
  } catch (error) {
    ElMessage.error('刷新数据失败，请稍后再试')
  } finally {
    // 关闭加载状态
    loadingInstance.close()
  }
}

// 获取仪表盘数据
const fetchDashboardData = async () => {
    try {
        const res = await getDashboardStatistics()
        if (res.code === 0 && res.data) {
            // 更新统计数据
            todaySalesCount.value = res.data.today_sales_count || 0
            storeTotalCount.value = res.data.store_total_count || 0
            salespersonTotalCount.value = res.data.salesperson_total_count || 0
            monthSalesAmount.value = res.data.month_sales_amount || 0
        } else {
            // API调用失败时的处理
            todaySalesCount.value = 0
            storeTotalCount.value = 0
            salespersonTotalCount.value = 0
            monthSalesAmount.value = 0
            
            ElMessage.warning({
                message: '获取仪表盘数据失败',
                type: 'warning'
            })
        }
    } catch (error) {
        // 发生错误时处理
        todaySalesCount.value = 0
        storeTotalCount.value = 0
        salespersonTotalCount.value = 0
        monthSalesAmount.value = 0
        
        ElMessage.warning({
            message: '获取仪表盘数据失败',
            type: 'warning'
        })
    }
}

// 初始化品牌销量图表
const initBrandChart = async () => {
    try {
        // 如果已经有实例，先销毁
        if (brandChart.value) {
            brandChart.value.dispose()
        }
        
        const chartDom = document.getElementById('brandChart')
        if (!chartDom) return
        
        brandChart.value = echarts.init(chartDom)
        
        // 添加加载动画
        brandChart.value.showLoading({
            text: '数据加载中...',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            color: '#2378f7'
        })
        
        try {
            // 获取实际品牌销量数据
            const res = await getBrandStatistics()
            let brandData = []
            
            if (res.code === 0 && res.data && res.data.length > 0) {
                brandData = res.data.map(item => ({
                    value: item.value || 0,
                    name: item.name || '未知'
                }))
            } else {
                // 数据为空时显示提示
                brandData = [{ value: 0, name: '暂无数据' }]
            }
            
            // 确保数据不为空
            if (!brandData || brandData.length === 0) {
                brandData = [{ value: 0, name: '暂无数据' }]
            }
            
            // 隐藏加载动画
            brandChart.value.hideLoading()
            
            const option = {
                title: {
                    text: '',
                    subtext: '各品牌销量占比',
                    left: 'center',
                    top: 0
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        if (!params || !params.name) {
                            return '数据加载中'
                        }
                        return `${params.seriesName}<br/>${params.name}: ${params.value} 台 (${params.percent}%)`
                    },
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderColor: '#ccc',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: '5%',
                    top: 'middle',
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        fontSize: 12
                    }
                },
                color: [
                    '#5470c6', '#91cc75', '#fac858', '#ee6666',
                    '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
                    '#ea7ccc', '#0d947a', '#48b0f7', '#725e82'
                ],
                series: [
                    {
                        name: '品牌销量',
                        type: 'pie',
                        radius: ['45%', '70%'],
                        center: ['40%', '50%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 8,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        labelLine: {
                            show: true,
                            length: 15,
                            length2: 10,
                            smooth: true
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 14,
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: brandData.sort((a, b) => b.value - a.value)  // 按销量降序排序
                    }
                ],
                animation: true,
                animationDuration: 1000,
                animationEasing: 'cubicInOut'
            }
            
            brandChart.value.setOption(option)
        } catch (error) {
            // 隐藏加载动画
            brandChart.value.hideLoading()
            
            // 显示错误提示
            brandChart.value.setOption({
                title: {
                    text: '数据加载失败',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        color: '#999',
                        fontSize: 16
                    }
                }
            })
        }
    } catch (error) {
        console.error('初始化品牌图表失败:', error)
    }
}

// 初始化每日销量统计图表
const initStoreChart = async () => {
    try {
        // 如果已经有实例，先销毁
        if (storeChart.value) {
            storeChart.value.dispose()
        }
        
        const chartDom = document.getElementById('storeChart')
        if (!chartDom) return
        
        storeChart.value = echarts.init(chartDom)
        
        // 添加加载动画
        storeChart.value.showLoading({
            text: '数据加载中...',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            color: '#2378f7'
        })
        
        try {
            // 获取每日销量统计数据
            const res = await getDailySalesStatistics()
            let salesData = []
            let dateLabels = []
            
            // 适配新的数据结构：检查res.data.list
            if (res.code === 0 && res.data) {
                // 获取正确的数据列表
                const dataList = res.data.list || (Array.isArray(res.data) ? res.data : [])
                
                if (dataList.length > 0) {
                    // 确保数据按日期排序
                    const sortedData = [...dataList].sort((a, b) => {
                        return new Date(a.date) - new Date(b.date)
                    })
                    
                    // 处理API返回的数据，适配不同的字段名
                    salesData = sortedData.map(item => {
                        // 尝试不同的销量字段名
                        const count = typeof item.total_sales === 'number' ? item.total_sales : 
                                    (typeof item.count === 'number' ? item.count : 
                                    (typeof item.sales_count === 'number' ? item.sales_count : 0))
                        return count
                    })
                    
                    // 格式化日期标签 (YYYY-MM-DD -> MM/DD)
                    dateLabels = sortedData.map(item => {
                        const dateStr = item.date || ''
                        if (dateStr.includes('-')) {
                            const dateParts = dateStr.split('-')
                            if (dateParts.length >= 3) {
                                return `${parseInt(dateParts[1])}/${parseInt(dateParts[2])}`
                            }
                        }
                        return dateStr
                    })
                } else {
                    dateLabels = ['暂无数据']
                    salesData = [0]
                }
            } else {
                // 数据为空的情况
                dateLabels = ['暂无数据']
                salesData = [0]
            }
            
            // 确保数据不为空
            if (!salesData || salesData.length === 0 || !dateLabels || dateLabels.length === 0) {
                dateLabels = ['暂无数据']
                salesData = [0]
            }
            
            // 隐藏加载动画
            storeChart.value.hideLoading()
            
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        if (!params || !params[0]) {
                            return '数据加载中'
                        }
                        const data = params[0]
                        return `${data.name} 日销量：${data.value} 台`
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
                    data: dateLabels,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        rotate: 0
                    },
                    name: '日期'
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    name: '销量（台）'
                },
                series: [
                    {
                        name: '每日销量',
                        type: 'bar',
                        barWidth: '60%',
                        data: salesData,
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} 台'
                        },
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#83bff6' },
                                { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#188df0' }
                            ]),
                            borderRadius: [4, 4, 0, 0] // 设置柱状图顶部圆角
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#2378f7' },
                                    { offset: 0.7, color: '#2378f7' },
                                    { offset: 1, color: '#83bff6' }
                                ])
                            },
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{c} 台',
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#2378f7'
                            }
                        }
                    }
                ]
            }
            
            storeChart.value.setOption(option)
        } catch (error) {
            // 隐藏加载动画
            storeChart.value.hideLoading()
            
            // 显示错误提示
            storeChart.value.setOption({
                title: {
                    text: '数据加载失败',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        color: '#999',
                        fontSize: 16
                    }
                }
            })
        }
    } catch (error) {
        console.error('初始化每日销量统计图表失败:', error)
    }
}

// 清理图表实例
const disposeCharts = () => {
    try {
        if (brandChart.value && !brandChart.value.isDisposed()) {
            brandChart.value.dispose()
        }
    } catch (error) {
        console.error('清理品牌图表失败:', error)
    }
    
    try {
        if (storeChart.value && !storeChart.value.isDisposed()) {
            storeChart.value.dispose()
        }
    } catch (error) {
        console.error('清理销量图表失败:', error)
    }
    
    brandChart.value = null
    storeChart.value = null
}

// 添加窗口尺寸变化时的重绘处理
const resizeHandler = () => {
    setTimeout(() => {
        if (brandChart.value) {
            brandChart.value.resize()
        }
        if (storeChart.value) {
            storeChart.value.resize()
        }
    }, 100)
}

// 监听路由变化
watch(() => route.fullPath, () => {
  // 无论什么原因导航到仪表盘页面，都标记需要刷新
  if (route.path === '/admin') {
    needRefresh.value = true
  }
}, { immediate: true })

// 组件被激活时（从缓存中恢复）
onActivated(() => {
  // 每次激活都刷新数据，确保数据最新
  refreshAllData()
})

// 添加监听事件，响应菜单点击刷新事件
const setupEventListeners = () => {
  // 添加自定义事件监听器，当点击左侧菜单跳转到该页面时触发刷新
  window.addEventListener('dashboard-refresh', refreshAllData)
}

// 移除监听事件
const removeEventListeners = () => {
  window.removeEventListener('dashboard-refresh', refreshAllData)
}

onMounted(async () => {
  // 初次加载刷新数据
  refreshAllData()
  
  // 监听窗口尺寸变化
  window.addEventListener('resize', resizeHandler)
  
  // 设置事件监听器
  setupEventListeners()
  
  // 添加自动重试机制
  const retryTimer = setTimeout(() => {
    const brandDom = document.getElementById('brandChart')
    const storeDom = document.getElementById('storeChart')
    
    // 检查图表是否成功初始化
    if (brandDom && (!brandChart.value || brandChart.value.isDisposed())) {
      initBrandChart()
    }
    
    if (storeDom && (!storeChart.value || storeChart.value.isDisposed())) {
      initStoreChart()
    }
  }, 1000)
  
  return () => {
    clearTimeout(retryTimer)
  }
})

onBeforeUnmount(() => {
  // 在组件卸载前清理图表实例
  disposeCharts()
  window.removeEventListener('resize', resizeHandler)
  removeEventListeners()
})

// 确保在组件被销毁时也清理图表实例
onUnmounted(() => {
  disposeCharts()
  removeEventListeners()
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>


