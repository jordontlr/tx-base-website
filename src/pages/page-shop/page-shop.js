import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-shop.less'
import view from './page-shop.stache'
import Pagination from '~/models/pagination'
import Shop from '~/models/shop'
import Uploads from '~/models/uploads'

export const ViewModel = DefineMap.extend({
  isSsr: {
    value: typeof process === 'object' && {}.toString.call(process) === '[object process]'
  },
  viewShopItem: {
    Type: Shop,
    value () {
      return new Shop({})
    }
  },
  loadingShop: {
    value: true,
    get (val, resolve) {
      if (!val) { return val }
      this.rowsPromise.then(resolve)
    }
  },
  filterTags: 'string',
  changeTags (to) {
    this.filterTags = to
    this.filterCategory = null
    $('#viewShopItem').modal('hide')

    this.loadPage(true)
  },
  clearFilterTags () {
    this.filterTags = null
    this.loadPage(true)
  },
  filterCategory: 'string',
  changeCategory (to) {
    if (this.filterCategory !== to) this.filterCategory = to
    else this.filterCategory = null
    this.loadPage(true)
  },
  sortType: {
    value: 'product'
  },
  changeSortType (to) {
    this.sortType = to
    this.loadPage(true)
  },
  sortDirection: {
    value: 'down'
  },
  changeSortDirection () {
    if (this.sortDirection === 'down') this.sortDirection = 'up'
    else this.sortDirection = 'down'
    this.loadPage(true)
  },
  displayType: {
    value: 'list'
  },
  changeDisplayType (to) {
    this.displayType = to
  },
  rowsPromise: {
    value () {
      return this.loadPage()
    }
  },
  rows: {
    Type: Shop.List
  },
  allCategories: {
    Type: Shop.List
  },
  categories: {
    get () {
      if (this.allCategories) {
        return this.allCategories.reduce((list, item) => {
          if (item.category !== '' && typeof item.category !== 'undefined' && !list.includes(item.category)) list.push(item.category)
          return list
        }, [])
      } else {
        return null
      }
    }
  },
  pagination: {
    Type: Pagination,
    value () {
      return {skip: 0, limit: 10}
    }
  },
  changeLimit (to) {
    this.pagination.limit = to
    this.loadPage()
  },
  loadPage (resetSkip) {
    let pagination = this.pagination

    let query = {
      $skip: pagination.skip,
      $limit: pagination.limit,
      listed: true
    }

    if (resetSkip) query.$skip = 0

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

    if (this.sortDirection === 'down') {
      query = Object.assign(query, {
        $sort: {
          [this.sortType]: -1
        }
      })
    } else {
      query = Object.assign(query, {
        $sort: {
          [this.sortType]: 1
        }
      })
    }

    return Shop.getList(query)
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

        Shop.getList()
          .then(shop => {
            this.allCategories = shop
          })
      })
      .catch(err => console.log(err))
  },
  openShopModal (shopItem) {
    this.viewShopItem = shopItem

    $('#viewShopItem').modal('show')
  },
  closeModal () {
    $('#viewShopItem').modal('hide')
  },
  quantityUp () {
    this.viewShopItem.quantity += 1
  },
  quantityDown () {
    if (this.viewShopItem.quantity > 0) this.viewShopItem.quantity -= 1
  }
})

export default Component.extend({
  tag: 'page-shop',
  ViewModel,
  view
})
