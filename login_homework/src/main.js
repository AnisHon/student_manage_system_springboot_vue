import '@/assets/common.css'

import elTableInfiniteScroll from 'el-table-infinite-scroll';


import {createApp} from 'vue'
import {createPinia} from 'pinia'

import {ElCollapseTransition} from 'element-plus'
import piniaPluginPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.component(ElCollapseTransition.name, ElCollapseTransition)


app.use(router)

const score = createPinia()
app.use(score)
score.use(piniaPluginPersist)
app.use(elTableInfiniteScroll);

app.mount('#app')
