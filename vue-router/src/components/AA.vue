<!--  -->
<template>
  <div>
    我是a组件的子组件AA
    {{$route.query.message}}  
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style lang='scss' scoped>
// @import 'assets/style/global';
</style>