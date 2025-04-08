/**
 * API 响应接口
 */
export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data?: T;
} 