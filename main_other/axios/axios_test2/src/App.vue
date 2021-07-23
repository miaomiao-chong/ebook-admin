<template>
  <div id="app">

  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    
    name:'app',
    created(){
      const url='https://test.youbaobao.xyz:18081/book/home/v2?openId=1234'
      axios.get(url).then((res)=>{
        console.log(res);
      })
    }
  }
</script>

<style lang="scss" scoped>

</style>