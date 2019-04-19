<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" class="mb-2" />
    <el-button v-waves class="filter-item" type="primary" @click="handleWordpressArticle">
      导出到文章
    </el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <!-- <el-table-column v-show="tableData.length" type="selection" align="center" /> -->
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" title="导出到wordpress文章">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="网站首页地址" prop="weburl">
          <el-input v-model="temp.weburl" @blur="webBlur" />
        </el-form-item>
        <el-form-item label="网站发布密码" prop="webpassword">
          <el-input v-model="temp.webpassword" type="password" />
        </el-form-item>
        <el-form-item label="发布状态" prop="postStatus">
          <el-select v-model="temp.postStatus" class="filter-item" placeholder="Please select">
            <el-option v-for="item in postStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="article_title">
          <el-select v-model="temp.article_title" class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章分类" prop="article_categories">
          <el-select v-model="temp.article_categories" multiple class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标签" prop="article_topics">
          <el-select v-model="temp.article_topics" multiple class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="dialogStatus==='article'?articlePublish('dataForm'):updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import waves from '@/directive/waves' // waves directive
import { postArticle } from '@/api/tag_auto_post'
import { async, resolve, reject } from 'q';
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      dialogFormVisible: false, // dialog show
      rules: {
        weburl: [{ required: true, message: '网站首页地址必需', trigger: 'blur' }],
        webpassword: [{ required: true, message: '网站发布密码必需', trigger: 'blur' }],
        postStatus: [{ required: true, message: '发布状态必需', trigger: 'change' }],
        article_title: [{ required: true, message: '文章标题必需', trigger: 'change' }]
      },
      temp: {
        weburl: 'http://localhost/',
        webpassword: 'shenjian.io',
        article_title: '',
        article_categories: [],
        article_topics: []
      },
      postStatusOptions: [
        {
          key: 'publish',
          display_name: '直接发布'
        },
        {
          key: 'draft',
          display_name: '存为草稿'
        }
      ],
      dialogStatus: 'article',
      fullscreenLoading: false
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 2

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 2m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    handleWordpressArticle() { // 导出文章到wordpress
      if (!this.tableData.length) {
        this.$message('请先导入数据!')
        return
      }
      this.dialogFormVisible = true
    },
    webBlur(e) { // 校验当前链接
      console.log(e)
    },
    articlePublish(formName) { // 文章发布
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _self = this
          // 异步单次提交
          async function postArticleAction(info) {
            // 分类列表
            const categories = new Array()
            _self.temp.article_categories.map(cate => {
              categories.push(info[cate])
            })
            // 标签列表
            const tags = new Array()
            _self.temp.article_topics.map(cate => {
              tags.push(info[cate])
            })
            const data = {
              article_title: info[_self.temp.article_title],
              article_categories: JSON.stringify(categories),
              article_topics: JSON.stringify(tags),
              postStatus: _self.temp.postStatus
            }
            data.__sign = _self.temp.webpassword // password
            await postArticle(_self.temp.weburl, data).then((res) => {}).catch((err) => console.log(err))
          }
          // 批量提交数据
          _self.fullscreenLoading = true
          const p = Promise.all(this.tableData.map(info => postArticleAction(info))).then(val => {console.log('resolve:'+val)}, err => {console.log('reject'+err)}
          ).finally(() => {
            _self.fullscreenLoading = false
          })
        }
      })
    }
  }
}
</script>
