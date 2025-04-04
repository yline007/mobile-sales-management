import axios from "@/axios"
import qs from 'qs'

// 模拟仪表盘统计数据
const mockDashboardData = {
    success: true,
    data: {
        articleTotalCount: 7,
        categoryTotalCount: 8,
        tagTotalCount: 15,
        pvTotalCount: 145731
    }
}

export function getDashboardArticleStatisticsInfo() {
    // 返回模拟数据
    return Promise.resolve(mockDashboardData)
}

export function getDashboardPublishArticleStatisticsInfo() {
    return axios.post("/admin/dashboard/publishArticle/statistics")
}

export function getDashboardPVStatisticsInfo() {
    return axios.post("/admin/dashboard/pv/statistics")
}

/**
 * 获取销售记录统计数据
 */
export function getDashboardStatistics() {
    return axios.get("/admin/dashboard/statistics")
}

/**
 * 获取销售趋势数据
 * @param {*} payload - 参数
 * @param {string} payload.type - 时间范围类型：week/month/year
 */
export function getSalesTrend(payload) {
    return axios.post("/admin/dashboard/salesTrend", payload)
}

/**
 * 获取品牌销量统计
 */
export function getBrandStatistics() {
    return axios.get("/admin/dashboard/brandStatistics")
}

/**
 * 获取门店销量统计
 */
export function getStoreStatistics() {
    return axios.get("/admin/dashboard/storeStatistics")
}

/**
 * 获取最新销售记录
 * @param {*} limit - 获取条数
 */
export function getLatestSalesRecords(limit = 5) {
    return axios.get(`/admin/dashboard/latestSalesRecords?limit=${limit}`)
}


