import { createApp } from 'vue'
import 'virtual:windi.css'

import '@/assets/main.css'
import 'animate.css';
import 'nprogress/nprogress.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
import "@/permission"

const app = createApp(App)

app.use(store)
app.use(router)

// 引入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app') 