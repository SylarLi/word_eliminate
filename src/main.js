import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from './store/index.js'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(store)

app.mount('#app')