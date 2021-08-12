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
          :label="item.label + '(' + item.num + ')'"
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
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="id"
        label="ID"
        sortable="custom"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        label="书名"
        sortable="custom"
        align="center"
        width="180"
      >
        <template slot-scope="{ row: { title } }">
          <span>{{ title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        sortable="custom"
        align="center"
        width="250"
      >
        <template slot-scope="{ row: { author } }">
          <span>{{ author }}</span>
        </template>
      </el-table-column>
      <!-- 换种方式 ，不使用插槽 -->
      <el-table-column
        label="出版社"
        prop="publisher"
        sortable="custom"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="分类"
        prop="categoryText"
        sortable="custom"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="语言"
        prop="language"
        sortable="custom"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        v-if="showCover"
        label="封面"
        prop="cover"
        align="center"
        width="150"
      >
        <template slot-scope="{ row: { cover } }">
          <a :href="cover" target="_blank">
            <img :src="cover" style="width: 120px; height: 180px" />
          </a>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="showCover" label="封面" prop="cover" align="center" width="150">
        <template slot-scope="scope">
          <a :href="scope.row.cover" target="_blank">
            <img :src="scope.row.cover"  style="width:120px;height:180px">
          </a>
        </template>
      </el-table-column> -->
      <el-table-column
        label="文件名"
        prop="fileName"
        sortable="custom"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="文件路径"
        prop="filePath"
        sortable="custom"
        align="center"
        width="150"
      >
      </el-table-column>

      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="default"
            @click="handleUpdate(row)"
            icon="el-icon-edit"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 翻页 -->
    <Pagination :total="0" />
  </div>
</template>

<script>
import Pagination from "../../components/Pagination/index";
import { getCategory, listBook } from "../../api/book";
// 这个老是报错，应该是依赖的问题，使用方法：v-waves
// import waves from '../../components/directive/waves'
export default {
  components: { Pagination },
  data() {
    return {
      // 存在多个table的时候能够对table进行区分
      tableKey: 0,
      listLoading: true,
      listQuery: {
        page:1,
        pageSize:5
      },
      showCover: false,
      // 查询条件是动态的
      categoryList: [],
      // 表格数据源
      list: [],
    };
  },
  mounted() {
    this.getCategoryList();
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      listBook(this.listQuery).then((response) => {
        console.log(response);
        const { list } = response.data;
        this.list = list;
        this.listLoading = false;
      });
    },
    // 排序事件
    sortChange(data) {
      console.log("sortChange", data);
    },
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
      this.getList();
    },
    handleCreate() {
      // 页面切换到/book/create 切换到上传图书
      this.$router.push("/book/create");
    },
    handleUpdate(row){
      console.log("handleUpdate",row);
      this.$router.push(`/book/edit/${row.fileName}`)
    }
  },
};
</script>

<style lang="scss" scoped>
</style>