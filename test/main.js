import Vue from 'vue'
import Auth from '../src/components/Auth.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Auth),
}).$mount('#app')
