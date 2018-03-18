import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './admin-shop.less'
import view from './admin-shop.stache'
import Quill from 'quill'
import Pagination from '~/models/pagination'
import Shop from '~/models/shop'
import Uploads from '~/models/uploads'

export const ViewModel = DefineMap.extend({
  isSsr: {
    value: typeof process === 'object' && {}.toString.call(process) === '[object process]'
  },
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
    value () {
      this.loadPage()
      return true
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

        if (!this.isSsr) {
          this.rows.forEach((currentRow) => {
            currentRow.imageData = []
          })

          let promises = []
          this.rows.forEach((rowValue, shopIndex) => {
            if (this.rows[shopIndex].imageId && this.rows[shopIndex].imageId.length > 0) {
              this.rows[shopIndex].imageId.forEach((shopRow, imageIndex) => {
                promises.push(
                  new Promise((resolve) => {
                    Uploads
                      .get({_id: this.rows[shopIndex].imageId[imageIndex]})
                      .then(imageData => {
                        resolve({shopIndex, imageIndex, uri: imageData.uri, _id: imageData._id})
                      })
                  })
                )
              })
            }
          })

          Promise.all(promises)
            .then((values) => {
              this.rows.forEach((currentShop) => {
                values.forEach((currentValue) => {
                  if (this.rows[currentValue.shopIndex] === currentShop) {
                    currentShop.imageData.push(currentValue.uri)
                  }
                })
              })
            })
        }

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

    if (this.editShopItem.imageData.length > 0) {
      let promises = []

      this.editShopItem.imageData.forEach((currentValue) => {
        if (currentValue) {
          promises.push(
            new Promise((resolve) => {
              let imageUpload = new Uploads({uri: currentValue})
              imageUpload
                .save()
                .then(imageInfo => {
                  resolve(imageInfo._id)
                })
            })
          )
        }
      })

      Promise.all(promises).then((values) => {
        this.editShopItem.imageId = values
        this.saveShopItemFunction()
      })
    } else {
      this.saveShopItemFunction()
    }
  },
  saveShopItemFunction () {
    this.editShopItem.delta = JSON.stringify(this.quill.getContents())
    this.editShopItem.description = $('.ql-editor').html()
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

      this.viewModel.quill = new Quill('#shop-desc', {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      })

      let _self = this

      $('input.image-input-btn').change(function () {
        let files = this.files

        for (let i = 0; i < files.length; i++) {
          ((file) => {
            let reader = new window.FileReader()
            reader.onload = (e) => {
              _self.viewModel.editShopItem.imageData.push(e.target.result)
            }
            reader.readAsDataURL(file)
          })(files[i])
        }
      })
    }
  }
})
