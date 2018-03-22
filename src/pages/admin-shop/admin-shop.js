import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './admin-shop.less'
import view from './admin-shop.stache'
import Quill from 'quill'
import Pagination from '~/models/pagination'
import Shop from '~/models/shop'

export const ViewModel = DefineMap.extend({
  disableForm: {
    default: false
  },
  processing: {
    default: false
  },
  session: {
    type: 'any'
  },
  quill: {
    type: 'any'
  },
  loadingShop: {
    type: 'boolean',
    default () {
      this.loadPage()
      return true
    }
  },
  rows: {
    Type: Shop.List
  },
  pagination: {
    Type: Pagination,
    default () {
      return {skip: 0, limit: 20}
    }
  },
  editShopItem: {
    Type: Shop,
    default () {
      return new Shop({})
    }
  },
  openShopItem (shop) {
    this.editShopItem = shop
    this.quill.updateContents(JSON.parse(this.editShopItem.delta))
    $('#editShopItem').modal('show')
  },
  addNew () {
    this.editShopItem = new Shop({})
    this.quill.updateContents(JSON.parse('{"ops":[{"insert":"\\n"}]}'))
    $('#editShopItem').modal('show')
  },
  deleteShopItem (shop) {
    // todo: maybe add an "are you sure" question
    shop.destroy()
  },
  loadPage () {
    this.loadingShop = true
    let pagination = this.pagination
    Shop.getList({$skip: pagination.skip, $limit: pagination.limit, $sort: {createdAt: -1}})
      .then(shop => {
        this.rows = shop
        this.pagination.total = shop.total

        setTimeout(() => { this.loadingShop = false }, 25)
      })
      .catch(err => {
        if (err.code === 401) this.session.error401()
        else console.log(err)
      })
  },
  updateListed (item) {
    item.save()
  },
  saveShopItem () {
    this.processing = true
    this.disableForm = true
    this.editShopItem.delta = JSON.stringify(this.quill.getContents())
    this.editShopItem.description = $('.ql-editor').html()
    if (this.editShopItem.description.replace('<br>', '').replace('<p>', '').replace('</p>', '') === '') this.editShopItem.description = ''
    this.editShopItem.tags = $('#shop-tags').val()

    this.editShopItem.save()
      .then(() => {
        this.processing = false
        this.disableForm = false

        this.clearForm()
      })
      .catch(err => {
        this.processing = false
        this.disableForm = false

        if (err.code === 401) this.session.error401()
        else console.log(err)
      })
  },
  clearForm () {
    this.editShopItem = new Shop({})
    this.quill.setContents(JSON.parse('{"ops":[{"insert":"\\n"}]}'))
    $('#editShopItem').modal('hide')
  },
  initFileUpload () {
    $('.image-input-btn').trigger('click')
  },
  deleteImage (imageData) {
    this.editShopItem.imageData.forEach((currentValue, index) => {
      if (currentValue === imageData) {
        this.editShopItem.imageData.splice(index, 1)
      }
    })
  },
  connectedCallback (el) {
    let imageUpload = (element) => {
      let files = element.target.files
      for (let i = 0; i < files.length; i++) {
        ((file) => {
          let reader = new window.FileReader()
          reader.onload = (e) => {
            this.editShopItem.imageData.push(e.target.result)
          }
          reader.readAsDataURL(file)
        })(files[i])
      }
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

    this.quill = new Quill('#shop-desc', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    })

    $(el).on('change', 'input.image-input-btn', imageUpload)

    return () => {
      $(el).off('change', 'input.image-input-btn', imageUpload)
    }
  }
})

export default Component.extend({
  tag: 'admin-shop',
  ViewModel,
  view
})
