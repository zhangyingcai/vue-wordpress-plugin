import request from '@/utils/request'

export function postArticle(url, data) { // 提交文章数据
  return request({
    url: `${url}?__ta=post`,
    method: 'post',
    data
  })
}
// type cate
export function postArticleCategorise(url, data) { // 查询文章分类 type = cate
  return request({
    url: `${url}?__ta=details`,
    method: 'post',
    data
  })
}

export function postCategories(url, data) { // 提交分类数据
  return request({
    url: `${url}?__ta=post_cagegries_insert`,
    method: 'post',
    data
  })
}
