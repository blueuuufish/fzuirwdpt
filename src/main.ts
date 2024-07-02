import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueRx from '@/plugins/vue-rx'


const app = createApp(App)

app.use(VueRx)
app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')