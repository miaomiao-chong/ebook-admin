<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <!-- filter -->
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        size="normal"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      ></el-input>
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        size="normal"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      ></el-input>

      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.label+'('+item.num+')'"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        class="filter-item"
        size="default"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        点击查询
      </el-button>
      <el-button
        type="primary"
        class="filter-item"
        size="default"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleCreate"
      >
        点击新增
      </el-button>

      <el-checkbox
        v-model="showCover"
        label=""
        :indeterminate="false"
        class="filter-item"
        style="margin-left: 10px"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>
    </div>
    <!-- 表格组件 -->
    <el-table></el-table>
    <!-- 翻页 -->
    <Pagination :total="0" />
  </div>
</template>

<script>
import Pagination from "../../components/Pagination/index";
import { getCategory } from "../../api/book";
// 这个老是报错，应该是依赖的问题，使用方法：v-waves
// import waves from '../../components/directive/waves'
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {},
      showCover: false,
      // 查询条件是动态的
      categoryList: [],
    };
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      getCategory().then((response) => {
        this.categoryList = response.data;
      });
    },
    changeShowCover(value) {
      this.showCover = value;
      console.log(this.showCover);
    },
    handleFilter() {
      console.log("handleFilter", this.listQuery);
    },
    handleCreate() {
      // 页面切换到/book/create 切换到上传图书
      this.$router.push("/book/create");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>