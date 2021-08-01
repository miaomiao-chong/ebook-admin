<template>
  <div>
    <Detail :is-edit="isEdit" />
  </div>
</template>
<script>
import Detail from '@/views/book/components/Detail'
export default {
  components: {
    Detail
  },
  data() {
    return {
      isEdit: true
    }
  }
}
</script>
