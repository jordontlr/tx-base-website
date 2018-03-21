import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './admin-blog.less'
import view from './admin-blog.stache'
import Quill from 'quill'
import Pagination from '~/models/pagination'
import Blog from '~/models/blog'

export const ViewModel = DefineMap.extend({
  newEditBlog: {
    Type: Blog,
    default () {
      return new Blog({})
    }
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
    type: 'boolean',
    default () {
      this.loadPage()
      return true
    }
  },
  rows: {
    Type: Blog.List
  },
  imageDataTemp: {
    type: 'string',
    default: null
  },
  pagination: {
    Type: Pagination,
    default () {
      return {skip: 0, limit: 10}
    }
  },
  loadPage () {
    this.loadingBlog = true
    let pagination = this.pagination
    Blog.getList({$skip: pagination.skip, $limit: pagination.limit, $sort: {createdAt: -1}})
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
    type: 'boolean',
    default: false
  },
  processing: {
    type: 'boolean',
    default: false
  },
  saveBlog () {
    this.processing = true
    this.disableForm = true

    let $datetime = $('#blog-datetime')
    if ($datetime.val() !== '') this.newEditBlog.datetime = Date.parse($datetime.val())

    if (this.imageDataTemp) this.newEditBlog.imageData = this.imageDataTemp

    this.newEditBlog.tags = $('#blog-tags').val()
    this.newEditBlog.delta = JSON.stringify(this.quill.getContents())
    this.newEditBlog.post = $('.ql-editor').html()
    this.newEditBlog.save()
      .then(() => {
        this.processing = false
        this.disableForm = false
        this.clearForm()
        $('#edit-modal').modal('hide')
      })
  },
  deleteBlog (blog) {
    blog.destroy()
  },
  editBlog (blog) {
    Blog.get(blog._id).then(data => {
      this.quill.updateContents(JSON.parse(data.delta))
      this.newEditBlog = data
      $('#edit-modal').modal('show')
    })
  },
  clearForm () {
    this.newEditBlog = new Blog({})
    this.imageDataTemp = null
    this.quill.setContents(JSON.parse('{"ops":[{"insert":"\\n"}]}'))
    $('#edit-modal').modal('hide')
  },
  initFileUpload () {
    $('.image-input-btn').trigger('click')
  },
  connectedCallback (el) {
    let fileChange = (element) => {
      const reader = new window.FileReader()
      let file = element.target.files[0]
      reader.readAsDataURL(file)

      reader.addEventListener('load', () => {
        this.viewModel.imageDataTemp = reader.result
      }, false)
    }

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

    this.quill = new Quill('#blog-post', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    })

    $(el).on('change', 'input.image-input-btn', fileChange)

    return () => {
      $(el).off('change', 'input.image-input-btn', fileChange)
    }
  }
})

export default Component.extend({
  tag: 'admin-blog',
  ViewModel,
  view
})
