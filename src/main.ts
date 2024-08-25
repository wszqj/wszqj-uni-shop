import { createSSRApp } from 'vue'
import pinia from './stores'
import App from './App.vue'
import uviewPlus from '../node_modules/uview-plus'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  app.use(pinia)
  return {
    app,
  }
}
