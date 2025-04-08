;(function(window) {
  window.globalConfig = {
    // API基础路径
    baseApi: 'http://localhost:8082/api',
    // WebSocket服务地址 - 使用当前域名
    wsUrl: `ws://localhost:8085`,
    // 其他配置项
    notification: {
      maxNotifications: 100,
      soundEnabled: true,
      desktopNotification: true
    }
  };
})(window); 