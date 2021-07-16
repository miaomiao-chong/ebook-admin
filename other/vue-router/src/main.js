import Vue from 'vue'
import App from './App.vue'
import Router  from 'vue-router'
import A from './components/A.vue'
import AA from './components/AA.vue'
import AA2 from './components/AA2.vue'
import B from './components/B.vue'
import hello from './components/HelloWorld.vue'

Vue.config.productionTip = false
Vue.use(Router)

const routes=[
  {
    path:'/a',
    component:A,
    redirect:'/a/aa',
    children:[
      {
        path:'/a/aa',
        component:AA
      },
      {
        path:'/a/:id',
        component:AA2,
       
      }
    ]
  },
  {path:'/b',component:B},
  {path:'/hello',component:hello},
]
const router=new Router({
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
