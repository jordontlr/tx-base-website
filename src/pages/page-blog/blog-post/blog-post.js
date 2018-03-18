import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './blog-post.less'
import view from './blog-post.stache'
import Blog from '~/models/blog'
import Uploads from '~/models/uploads'

export const ViewModel = DefineMap.extend({
  blogPost: {
    Type: Blog
  },
  slug: {
    type: 'string',
    value: null
  },
  loadingBlogPost: {
    value: true,
    get (val, resolve) {
      if (!val) { return val }
      this.blogPromise.then(resolve)
    }
  },
  authorPosts: {
    Type: Blog.list
  },
  categoryPosts: {
    Type: Blog.list
  },
  errorNotFound: {
    value: false
  },
  blogPromise: {
    value () {
      return Blog.getList({ 'linkTitle': this.slug, published: true })
        .then(blog => {
          if (blog.length === 0) {
            this.errorNotFound = true
          } else {
            this.blogPost = blog[0]
            let query = {
              $limit: 3,
              $sort: {
                datetime: -1
              },
              published: true
            }

            if (this.blogPost.author) {
              let authorQuery = Object.assign({}, query, { author: this.blogPost.author, linkTitle: {$nin: this.blogPost.linkTitle} })
              Blog.getList(authorQuery)
                .then(blog => {
                  if (blog.length > 0) {
                    this.authorPosts = blog
                  } else {
                    let categoryQuery = Object.assign({}, query, { category: this.blogPost.category, linkTitle: {$nin: this.blogPost.linkTitle} })
                    Blog.getList(categoryQuery)
                      .then(blog => {
                        if (blog.length > 0) this.categoryPosts = blog
                      })
                  }
                })
            }
            setTimeout(() => { this.loadingBlogPost = false }, 25)
          }
        })
        .catch(err => console.log(err))
    }
  }
})

export default Component.extend({
  tag: 'blog-post',
  ViewModel,
  view
})
