import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-blog.less'
import view from './page-blog.stache'
import Pagination from '~/models/pagination'
import Blog from '~/models/blog'

export const ViewModel = DefineMap.extend({
  loadingBlog: {
    value: true,
    get (val, resolve) {
      if (!val) { return val }
      this.rowsPromise.then(resolve)
    }
  },
  rowsPromise: {
    value () {
      let pagination = this.pagination
      return Blog.getList({$skip: pagination.skip, $limit: pagination.limit, $sort: {createdAt: -1}})
        .then(blog => {
          this.rows = blog
          this.pagination.total = blog.total
          setTimeout(() => { this.loadingBlog = false }, 25)
        })
        .catch(err => console.log(err))
    }
  },
  rows: {
    Type: Blog.List
  },
  pagination: {
    Type: Pagination,
    value () {
      return {skip: 0, limit: 10}
    }
  }
})

export default Component.extend({
  tag: 'page-blog',
  ViewModel,
  view
})
