import { createApp } from 'vue'
import { LockPlugin } from '@snapshot-labs/lock/plugins/vue3'
import options from '@/helpers/auth'
import App from './App.vue'
import './assets/styles/tailwind.css'

const app = createApp(App)

app.use(LockPlugin, options)

app.mount('#app')
