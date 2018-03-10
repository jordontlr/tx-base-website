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
    type: 'string'
  },
  loadingBlogPost: {
    value: true,
    get (val, resolve) {
      if (!val) { return val }
      this.blogPromise.then(resolve)
    }
  },
  errorNotFound: {
    value: false
  },
  blogPromise: {
    value () {
      return Blog.getList({'linkTitle': this.slug, published: 'true'})
        .then(blog => {
          if (blog.length === 0) {
            this.errorNotFound = true
          } else {
            this.blogPost = blog[0]
            if (this.blogPost.imageId !== 'undefined' && this.blogPost.imageId !== '' && this.blogPost.imageId) {
              Uploads
                .get({ _id: this.blogPost.imageId })
                .then(imageData => {
                  this.blogPost.imageData = imageData.uri
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
