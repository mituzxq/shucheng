
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const axiosInstance = axios.create({
	baseURL: "http://47.236.107.203:3000"
});

const app = createApp(App)
app.config.globalProperties.axios = axiosInstance;
app.use(ElementPlus).use(router)

app.mount('#app')
