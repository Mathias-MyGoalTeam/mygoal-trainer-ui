import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupLocalization } from './language'
import './assets/scss/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupLocalization(app)

app.mount('#app')
