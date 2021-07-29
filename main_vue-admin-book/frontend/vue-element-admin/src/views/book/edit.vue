<template>
  <div>
    <Detail :is-edit="true" />
  </div>
</template>

<script>
import Detail from '@/views/book/components/Detail'
export default {
  name: 'EditBook',
  components: { Detail }
}
</script>

<style lang="scss" scoped>

</style>
