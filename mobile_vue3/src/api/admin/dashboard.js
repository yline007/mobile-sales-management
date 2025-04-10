import axios from "@/axios"

/**
 * 获取仪表盘统计数据
 * @returns {Promise} 返回统计数据，包含：
 * - today_sales_count: 今日销量
 * - store_total_count: 门店总数
 * - salesperson_total_count: 销售员总数
 * - month_sales_amount: 月销售额
 */
export function getDashboardStatistics() {
    return axios.get("/api/admin/dashboard/statistics")
}

/**
 * 获取品牌销量统计
 */
export function getBrandStatistics() {
    return axios.get("/api/admin/dashboard/brand_statistics")
}

/**
 * 获取每日销量统计
 */
export function getDailySalesStatistics() {
    return axios.get("/api/admin/dashboard/daily_sales")
}
