import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import './js/globals.js'
import { currencyFormat } from './js/filters.js'

window.Buffer = require('buffer/').Buffer;

Vue.config.productionTip = false

Vue.filter("currencyFormat", currencyFormat)

new Vue({
  render: h => h(App),
}).$mount('#app')
