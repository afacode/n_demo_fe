// import './assets/index.scss'
// import './assets/main.css'
// import 'ant-design-vue/dist/reset.css';
import '@/styles/index.less';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'



// 重写log
// if (import.meta.env.VITE_SAAS_NODE_ENV === 'prod') {
//   console.log = () => null;
// }

// 全局方法
// globalMethods(app);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
