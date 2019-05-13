<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" class="mb-2" />
    <el-button v-waves class="filter-item" type="primary" @click="handleWordpressArticle">
      导出到文章
    </el-button>
    <el-button v-waves class="filter-item" type="primary" @click="handleWrodpressCate">
      导出到分类
    </el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <!-- <el-table-column v-show="tableData.length" type="selection" align="center" /> -->
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]">
      <el-form v-show="dialogStatus==='article'" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="170px" style="width: auto; margin-left:50px;">
        <el-form-item label="网站首页地址" prop="weburl">
          <el-input v-model="temp.weburl" @blur="webBlur" />
        </el-form-item>
        <el-form-item label="网站发布密码" prop="webpassword">
          <el-input v-model="temp.webpassword" />
        </el-form-item>
        <el-form-item label="发布状态" prop="postStatus">
          <el-select v-model="temp.postStatus" clearable class="filter-item" placeholder="Please select">
            <el-option v-for="item in postStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="article_title">
          <el-select v-model="temp.article_title" clearable class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章分类" prop="article_categories">
          <el-select v-model="temp.article_categories" clearable multiple class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="article_content">
          <el-select v-model="temp.article_content" clearable multiple class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标签" prop="article_topics">
          <el-select v-model="temp.article_topics" clearable multiple class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form v-show="dialogStatus==='category'" ref="category" :rules="categoryrules" :model="categorytemp" label-position="left" label-width="170px" style="width: auto; margin-left:50px;">
        <el-form-item label="网站首页地址" prop="weburl">
          <el-input v-model="categorytemp.weburl" @blur="webBlur" />
        </el-form-item>
        <el-form-item label="网站发布密码" prop="webpassword">
          <el-input v-model="categorytemp.webpassword" />
        </el-form-item>
        <el-form-item label="分类名称" prop="category_name">
          <el-select v-model="categorytemp.category_name" clearable class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类描述" prop="category_description">
          <el-select v-model="categorytemp.category_description" clearable class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类别名,用于路由" prop="category_slug">
          <el-select v-model="categorytemp.category_slug" clearable class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类父级id(必须是数字)" prop="category_parent">
          <el-select v-model="categorytemp.category_parent" clearable class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组id(必须是数字)" prop="category_group">
          <el-select v-model="categorytemp.category_group" clearable class="filter-item" placeholder="Please select">
            <el-option v-for="(item, index) in tableHeader" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类图片" prop="category_img">
          <el-select v-model="categorytemp.category_img" clearable class="filter-item" placeholder="Please select">
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
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import waves from '@/directive/waves' // waves directive
import { postArticle, postCategories } from '@/api/tag_auto_post'
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
        article_title: [{ required: true, message: '文章标题必需', trigger: 'change' }]
      },
      categoryrules: {
        weburl: [{ required: true, message: '网站首页地址必需', trigger: 'blur' }],
        webpassword: [{ required: true, message: '网站发布密码必需', trigger: 'blur' }],
        category_name: [{ required: true, message: '分类名称必需', trigger: 'change' }]
      },
      temp: {
        weburl: 'http://localhost/',
        webpassword: 'shenjian.io',
        article_title: undefined,
        article_content: '',
        postStatus: 'publish',
        article_categories: [],
        article_topics: []
      },
      categorytemp: {
        weburl: 'http://localhost/',
        webpassword: 'shenjian.io',
        category_name: undefined,
        category_description: '',
        category_parent: '',
        category_group: '',
        category_img: '',
        category_slug: ''
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
      fullscreenLoading: false,
      textMap: {
        article: '导出到wordpress文章',
        category: '导出到wordpress分类',
      }
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
      this.dialogStatus = 'article'
    },
    handleWrodpressCate() {
      if (!this.tableData.length) {
        this.$message('请先导入数据!')
        return
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'category'
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
            const categories = []
            _self.temp.article_categories.map(cate => {
              categories.push(info[cate])
            })
            // 标签列表
            const tags = []
            _self.temp.article_topics.map(cate => {
              tags.push(info[cate])
            })
            const data = {
              article_title: info[_self.temp.article_title],
              article_content: info[_self.temp.article_content],
              article_categories: JSON.stringify(categories),
              article_topics: JSON.stringify(tags),
              postStatus: _self.temp.postStatus
            }
            data.__sign = _self.temp.webpassword // password
            // 同步提交完成
            await postArticle(_self.temp.weburl, data).then((res) => {}).catch((err) => console.log(err))
          }
          // 批量提交数据
          _self.fullscreenLoading = true
          Promise.all(this.tableData.map(info => postArticleAction(info))).then(val => { 
            console.log('resolve:' + val.length)
            this.$message({
              message: `提交成功数量:${val.length}`,
              type: 'success'
            })
          }, err => {
            console.log('reject' + err)
          }).finally(() => {
            _self.fullscreenLoading = false
          })
        }
      })
    },
    categoryPublish(formName) { // 文章发布
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _self = this
          // 异步单次提交
          async function postArticleAction(info) {
            const data = {
              category_name: info[_self.categorytemp.category_name],
              category_description: info[_self.categorytemp.category_description],
              category_parent: info[_self.categorytemp.category_parent],
              category_group: info[_self.categorytemp.category_group],
              category_img: info[_self.categorytemp.category_img],
              category_slug: info[_self.categorytemp.category_slug]
            }
            data.__sign = _self.categorytemp.webpassword // password
            // 同步提交完成
            await postCategories(_self.categorytemp.weburl, data).then((res) => {}).catch((err) => console.log(err))
          }
          // 批量提交数据
          _self.fullscreenLoading = true
          Promise.all(this.tableData.map(info => postArticleAction(info))).then(val => { 
            console.log('resolve:' + val.length)
            _self.dialogFormVisible = false
            this.$message({
              message: `提交成功数量:${val.length}`,
              type: 'success'
            })
          }, err => {
            console.log('reject' + err)
          }).finally(() => {
            _self.fullscreenLoading = false
          })
        }
      })
    }
  }
}
</script>
