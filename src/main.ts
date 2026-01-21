import './assets/main.css'
import './styles/theme.css'
import 'vant/lib/index.css'

import { createApp } from 'vue'
import pinia from './stores'
import { Lazyload } from 'vant'

import App from './App.vue'
import router from './router'

// 引入 Mock 数据
import './mock'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Lazyload) // 注册 Vant Lazyload 插件

app.mount('#app')
