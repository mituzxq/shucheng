import {
	createApp
} from 'vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue';
import router from './router/index.js';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: "http://localhost:3000"
});

const app = createApp(App);
app.config.globalProperties.axios = axiosInstance;
app.use(router).use(ElementPlus).mount('#app');