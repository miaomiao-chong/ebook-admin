<template>
  <div class="detail">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button v-if="!isEdit"> 显示帮助 </el-button>
        <el-button type="warning">
          {{ isEdit ? "编辑电子书" : "新增电子书" }}
        </el-button>
      </sticky>
      <!-- <div style="background: yellow; height: 5000px"></div> -->
      <div class="detail-container">
        <el-row>
          <Warning />
          <el-col :span="24" :offset="0">
            <!-- 表单控件的具体样式 -->
            <EbookUpload />
          </el-col>
          <el-col :span="24" :offset="0" />
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput' // 粘性header组件
import Warning from './Warning' // 粘性header组件
import EbookUpload from '@/components/EbookUpload' // 粘性header组件

const defaultForm = {
  status: 'draft'
}
export default {
  components: { Sticky, MDinput, Warning, EbookUpload },
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm)
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.detail {
  padding: 5px,0px;
    position: relative;
    .detail-container {
      padding: 40px 45px 20px 50px;
      .preview-img {
        width: 200px;
        height: 270px;
      }
      .contents-wrapper {
        padding: 5px 0;
      }
    }
  }

</style>
