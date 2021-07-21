<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      // 判断路由是不是external
      if (this.isExternal) {
        return {
          // 如果是的话把url直接传进来（外链）
          // 就是说如果把/book/crreate写成http形式的时候 就会变成一个a标签，
          // 并且打开一个新链接
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      // 如果不是链接的话就会变成router-link
      return {
        to: to
      }
    }
  }
}
</script>
