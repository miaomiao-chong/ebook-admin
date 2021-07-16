import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import A from './components/A.vue'
import AA from './components/AA.vue'
import B from './components/B.vue'
import BB from './components/BB.vue'
import hello from './components/HelloWorld.vue'
Vue.config.productionTip = false
Vue.use(Router)

const routes=[
  
  {
    path:'/a',
    component:A,
    redirect:'/a/aa',
    children:[{
      path:'/a/aa',
      component:AA
    }]
  },
  {
    path:'/b',
    component:B,
    children:[{
      path:'/b/bb',
      component:BB
    }]
  },
  {path:'/hello',component:hello}
]

const router=new Router({
  routes
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
