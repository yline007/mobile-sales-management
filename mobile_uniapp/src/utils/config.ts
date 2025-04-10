// 1. 定义不同环境的配置
const config = {
  development: {
    apiBaseUrl: 'http://localhost:8082', // 开发环境 API 地址
    wsUrl: 'ws://localhost:2345', // 开发环境 WebSocket 地址
    // 其他开发环境配置...
  },
  production: {
    apiBaseUrl: 'http://113.45.45.237:8081', // 生产环境 API 地址
    wsUrl: 'ws://113.45.45.237:8081:2345', // 生产环境 WebSocket 地址
    // 其他生产环境配置...
  }
};

// 2. 根据 process.env.NODE_ENV 选择当前环境配置
console.log('process.env.NODE_ENV -- ', process.env.NODE_ENV)
// 在小程序环境中,通过编译时的环境变量判断
// development - 开发环境(npm run dev)
// production - 生产环境(npm run build) 
const environment = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const currentConfig = config[environment as keyof typeof config] || config.production; // Fallback to production

// 3. 修改 getConfig 函数
/**
 * 获取配置项
 * @param key 配置键名
 * @param defaultValue 默认值
 */
export function getConfig<T = any>(key: keyof typeof currentConfig, defaultValue?: T): T {
  const value = currentConfig[key];
  return value !== undefined ? (value as T) : (defaultValue as T);
}

/**
 * 获取API基础地址
 */
export function getApiBaseUrl(): string {
  return getConfig('apiBaseUrl', '');
}

/**
 * 获取 WebSocket 地址
 */
export function getWsUrl(): string {
  return getConfig('wsUrl', '');
}

export default {
  getConfig,
  getApiBaseUrl,
  getWsUrl // 导出 getWsUrl
}; 