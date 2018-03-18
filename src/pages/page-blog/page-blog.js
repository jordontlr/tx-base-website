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
  filterAuthor: 'string',
  filterCategory: 'string',
  filterTags: 'string',
  rowsPromise: {
    value () {
      let pagination = this.pagination

      let query = {
        $skip: pagination.skip,
        $limit: pagination.limit,
        $sort: {
          datetime: -1
        },
        published: true
      }

      if (this.filterAuthor) {
        query = Object.assign(query, {
          author: this.filterAuthor
        })
      }

      if (this.filterCategory) {
        query = Object.assign(query, {
          category: this.filterCategory
        })
      }

      if (this.filterTags) {
        query = Object.assign(query, {
          tags: { $in: [ this.filterTags ] }
        })
      }

      return Blog.getList(query)
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
