<template>
  <div class="app-container">
    <el-input v-model="temp.weburl" class="filter-item mb-2" />
    <el-input v-model="temp.webpassword" class="filter-item mb-2" />
    <el-button class="filter-item" type="primary" @click="getList">
      刷新
    </el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column label="id" prop="id" />
      <el-table-column label="分类名称" prop="text" />
      <el-table-column label="描述" prop="description" />
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="170px" style="width: auto; margin-left:50px;">
        <el-form-item label="网站首页地址" prop="weburl">
          <el-input v-model="temp.weburl" @blur="webBlur" />
        </el-form-item>
        <el-form-item label="网站发布密码" prop="webpassword">
          <el-input v-model="temp.webpassword" />
        </el-form-item>
        
        <el-form-item label="分类标题" prop="article_title">
          <el-input v-model="temp.category_name" prop="category_name" />
        </el-form-item>
        <el-form-item label="分类描述" prop="article_title">
          <el-input v-model="temp.category_name" prop="category_name" />
        </el-form-item>
        <el-form-item label="分类父级" prop="article_categories">
          <el-select v-model="temp.article_categories" multiple class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="dialogStatus==='article'?articlePublish('dataForm'):categoryPublish('category')">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { postArticleCategorise } from '@/api/tag_auto_post'
export default {
  name: 'UpdateCate',
  data() {
    return {
      tableData: [],
      temp: {
        weburl: 'http://localhost/',
        webpassword: 'shenjian.io'
      },
      dialogFormVisible: false
    }
  },
  methods: {
    getList() {
      const type = 'cate'
      const url = this.temp.weburl
      const __sign = this.temp.webpassword
      postArticleCategorise(url, { type, __sign }).then(res => {
        res.data.length && res.data.map((info) => {
          info.description = decodeURI(info.description)
          info.text = decodeURI(info.text)
        })
        this.tableData = res.data || []
      }).catch(err => console.log(err))
    }
  }
}
</script>
