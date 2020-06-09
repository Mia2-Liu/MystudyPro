/*
 * @Author: liuyaya 
 * @Date: 2019-09-17 16:20:02 
 * @Last Modified by: liuyaya
 * @Last Modified time: 2019-10-23 16:59:22
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueRouter from 'vue-router'
// import vueResource from 'vue-resource'

import router from './router/index.js'
import VueRouter from 'vue-router';
import axios from 'axios'
Vue.config.productionTip = false

Vue.use(vueRouter)
// Vue.use(vueResource)
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://jsonplaceholder.typicode.com/'
//自定义键盘修饰符
Vue.config.keyCodes.f2 = 113
//全局配置axois

//创建路由
const routers = new VueRouter({
  routes: router,
  mode:'history',
  // linkActiveClass:'myActive'//设置自定义当前状态的class名
  // linkExactActiveClass:'active'
})
// 自定义指令，指令名，不需要加“v-”,调用的时候需要加“v-”
// Vue.directive('rainbow',{
//   bind(el,binding,vnode){
//     /*
//     *el: 绑定自定义属性的元素
//     *binding.value: 自定义属性传的名字(v-rainbow="'wide'"),值为字符串，或者对象，或者数组。binding.wide,
//     *binding.ary: (v-rainbow:normal='wide'),binding.arg.normal
//     *   */
//     el.style.color= '#'+ Math.random().toString(16).slice(2,8);
//   }
// })
// Vue.directive('rainbow',function(el,binding,vnode){
//   //自定义指令，如果只用bind和update，可以简写，
//   //这里的function等于把代码写到了bind和update里去了
//   el.style.color= '#'+ Math.random().toString(16).slice(2,8);
// })

Vue.directive('theme',{
  bind(el,binding,vnode){
    if(binding.value == 'wide'){
      el.style.width = '100%'
    }
    if(binding.arg == 'column'){
      el.style.background = '#7788cc'
    }
  }
})


// 自定义过滤器(全局定义，如果不是公用方法，最好以函数的方式定义在组件里)
// Vue.filter('snippet',function(value){
//   return value.slice(1,100)+'...'
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router: routers
})
