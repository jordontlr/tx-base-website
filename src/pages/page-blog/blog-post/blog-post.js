import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './blog-post.less'
import view from './blog-post.stache'
import Blog from '~/models/blog'

export const ViewModel = DefineMap.extend({
  blogPost: {
    Type: Blog
  },
  slug: {
    type: 'string'
  },
  loadingBlogPost: {
    value: true,
    get (val, resolve) {
      if (!val) { return val }
      this.blogPromise.then(resolve)
    }
  },
  blogPromise: {
    value () {
      return Blog.getList({'linkTitle': this.slug})
        .then(blog => {
          this.blogPost = blog[0]
          setTimeout(() => { this.loadingBlogPost = false }, 25)
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
