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
    value: false
  },
  processing: {
    value: false
  },
  session: {
    type: 'any'
  },
  quill: {
    type: 'any'
  },
  loadingShop: {
    type: 'boolean',
    value: true,
    get () {
      this.loadPage()
    }
  },
  rows: {
    Type: Shop.List
  },
  pagination: {
    Type: Pagination,
    value () {
      return {skip: 0, limit: 20}
    }
  },
  editShopItem: {
    Type: Shop,
    value () {
      return new Shop({})
    }
  },
  openShopItem (shop) {
    this.editShopItem = shop
    if (this.editShopItem.delta) this.quill.setContents(JSON.parse(this.editShopItem.delta))
    $('#editShopItem').modal('show')
  },
  addNew () {
    this.editShopItem = new Shop({})
    this.quill.setContents(JSON.parse('{"ops":[{"insert":"\\n"}]}'))
    $('#editShopItem').modal('show')
  },
  deleteShopItem (shop) {
    // todo: maybe add an "are you sure" question
    shop.destroy()
  },
  loadPage () {
    this.loadingShop = true
    let pagination = this.pagination
    Shop.getList({$skip: pagination.skip, $limit: pagination.limit})
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
  saveShopItem () {
    this.processing = true
    this.disableForm = true

    this.editShopItem.delta = JSON.stringify(this.quill.getContents())
    this.editShopItem.description = $('.ql-editor').html()

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
  }
})

export default Component.extend({
  tag: 'admin-shop',
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

      this.viewModel.quill = new Quill('#shop-description', {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      })

      // const reader = new window.FileReader()
      // $('input.image-input-btn').change(function () {
      //   let file = this.files[0]
      //   reader.readAsDataURL(file)
      // })
      //
      // reader.addEventListener('load', () => {
      //   this.viewModel.imageData = reader.result
      // }, false)
    }
  }
})
