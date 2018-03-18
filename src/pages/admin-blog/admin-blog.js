import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './admin-blog.less'
import view from './admin-blog.stache'
import Quill from 'quill'
import Pagination from '~/models/pagination'
import Blog from '~/models/blog'
import Uploads from '~/models/uploads'

export const ViewModel = DefineMap.extend({
  newEditBlog: {
    Type: Blog,
    Value: Blog
  },
  quill: {
    type: 'any'
  },
  titleError: 'string',
  authorError: 'string',
  session: {
    type: 'any'
  },
  loadingBlog: {
    value: true
  },
  rows: {
    Type: Blog.List
  },
  imageData: 'string',
  pagination: {
    Type: Pagination,
    value () {
      return {skip: 0, limit: 10}
    }
  },
  loadPage () {
    this.loadingBlog = true
    let pagination = this.pagination
    Blog.getList({$skip: pagination.skip, $limit: pagination.limit})
      .then(blog => {
        this.rows = blog
        this.pagination.total = blog.total
        setTimeout(() => { this.loadingBlog = false }, 25)
      })
      .catch(err => {
        if (err.code === 401) this.session.error401()
        else console.log(err)
      })
  },
  disableForm: {
    value: false
  },
  processing: {
    value: false
  },
  saveBlog () {
    this.processing = true
    this.disableForm = true

    let $datetime = $('#blog-datetime')

    if ($datetime.val() !== '') this.newEditBlog.datetime = Date.parse($datetime.val())

    this.newEditBlog.tags = $('#blog-tags').val()

    if (this.imageData) {
      let sendObj = {
        uri: this.imageData
      }
      let imageUpload = new Uploads(sendObj)
      imageUpload
        .save()
        .then(imageInfo => {
          this.newEditBlog.imageId = imageInfo._id
          this.newEditBlog.delta = JSON.stringify(this.quill.getContents())
          this.newEditBlog.post = $('.ql-editor').html()
          this.newEditBlog.save()
            .then(() => {
              this.processing = false
              this.disableForm = false
              $('#edit-modal').modal('hide')
            })
        })
    } else {
      this.newEditBlog.delta = JSON.stringify(this.quill.getContents())
      this.newEditBlog.post = $('.ql-editor').html()
      this.newEditBlog.save()
        .then(() => {
          this.processing = false
          this.disableForm = false
          $('#edit-modal').modal('hide')
        })
    }
  },
  deleteBlog (blog) {
    blog.destroy()
  },
  editBlog (blog) {
    Blog.get(blog._id).then(data => {
      this.quill.updateContents(JSON.parse(data.delta))
      this.newEditBlog = data
      if (this.newEditBlog.imageId !== 'undefined' && this.newEditBlog.imageId !== '' && this.newEditBlog.imageId) {
        Uploads
          .get({ _id: this.newEditBlog.imageId })
          .then(imageData => {
            this.imageData = imageData.uri
          })
      }
      $('#edit-modal').modal('show')
    })
  },
  clearForm () {
    this.newEditBlog = new Blog({})
    this.imageData = null
    this.quill.setContents(JSON.parse('{"ops":[{"insert":"\\n"}]}'))
    $('#edit-modal').modal('hide')
  },
  initFileUpload () {
    $('.image-input-btn').trigger('click')
  }
})

export default Component.extend({
  tag: 'admin-blog',
  ViewModel,
  view,
  events: {
    inserted: function () {
      let toolbarOptions = [
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'image', 'code-block'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'color': []}, {'background': []}],
        [{'align': []}],
        ['link'],
        ['clean']
      ]

      this.viewModel.quill = new Quill('#blog-post', {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      })

      let pagination = this.viewModel.pagination
      Blog.getList({$skip: pagination.skip, $limit: pagination.limit, $sort: {createdAt: -1}})
        .then(blog => {
          this.viewModel.rows = blog
          this.viewModel.pagination.total = blog.total
          setTimeout(() => { this.viewModel.loadingBlog = false }, 25)
        })
        .catch(err => {
          if (err.code === 401) this.viewModel.session.error401()
          else console.log(err)
        })

      const reader = new window.FileReader()
      $('input.image-input-btn').change(function () {
        let file = this.files[0]
        reader.readAsDataURL(file)
      })

      reader.addEventListener('load', () => {
        this.viewModel.imageData = reader.result
      }, false)
    }
  }
})
