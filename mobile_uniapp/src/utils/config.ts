interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  [key: string]: any;
}

declare global {
  interface Window {
    APP_CONFIG: AppConfig;
  }
}

/**
 * 获取配置项
 * @param key 配置键名
 * @param defaultValue 默认值
 */
export function getConfig<T = any>(key: keyof AppConfig, defaultValue?: T): T {
  // #ifdef H5
  if (window.APP_CONFIG && window.APP_CONFIG[key] !== undefined) {
    return window.APP_CONFIG[key] as T;
  }
  // #endif

  // #ifdef MP || APP-PLUS
  // 小程序和APP环境下，可以从本地缓存读取配置
  const config = uni.getStorageSync('APP_CONFIG');
  if (config && config[key] !== undefined) {
    return config[key] as T;
  }
  // #endif

  return defaultValue as T;
}

/**
 * 获取API基础地址
 */
export function getApiBaseUrl(): string {
  return getConfig('apiBaseUrl', 'http://localhost:8082');
}

/**
 * 获取WebSocket地址
 */
export function getWsUrl(): string {
  return getConfig('wsUrl', 'ws://localhost:8082');
}

export default {
  getConfig,
  getApiBaseUrl,
  getWsUrl
}; 