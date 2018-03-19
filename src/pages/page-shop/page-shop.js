import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-shop.less'
import view from './page-shop.stache'
import Pagination from '~/models/pagination'
import Shop from '~/models/shop'
import Cart from '~/models/cart'

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
  userCart: {
    Type: Cart,
    value () {
      return new Cart({})
    }
  },
  addToCart (item) {
    let found = false
    this.userCart.items.forEach((currentVal) => {
      if (currentVal === item) {
        currentVal.quantity += 1
        found = true
      }
    })
    if (!found) {
      if (item.quantity === 0) item.quantity = 1
      item.addedToCart = true
      this.userCart.items.push(item)
    }
  },
  loadingShop: {
    value: true,
    get (val, resolve) {
      if (!val) { return val }
      this.rowsPromise.then(resolve)
    }
  },
  loadingShopList: {
    type: 'boolean',
    value: false
  },
  filterTags: 'string',
  changeTags (to) {
    this.loadingShopList = true
    this.pagination.skip = 0
    this.filterTags = to
    this.filterCategory = null
    $('#viewShopItem').modal('hide')
    this.loadPage()
  },
  clearFilterTags () {
    this.loadingShopList = true
    this.filterTags = null
    this.loadPage(true)
  },
  filterCategory: 'string',
  changeCategory (to) {
    this.loadingShopList = true
    this.pagination.skip = 0
    if (this.filterCategory !== to) this.filterCategory = to
    else this.filterCategory = null
    this.loadPage()
  },
  sortType: {
    value: 'product'
  },
  changeSortType (to) {
    if (this.sortType !== to) {
      this.loadingShopList = true
      this.pagination.skip = 0
      this.sortType = to
      this.loadPage()
    }
  },
  sortDirection: {
    value: 'down'
  },
  changeSortDirection () {
    this.loadingShopList = true
    this.pagination.skip = 0
    if (this.sortDirection === 'down') this.sortDirection = 'up'
    else this.sortDirection = 'down'
    this.loadPage()
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
          if (item.category !== '' && typeof item.category !== 'undefined') {
            let notFound = true
            list.forEach((currentObj, index) => {
              if (currentObj.item === item.category) {
                list[index].count += 1
                notFound = false
              }
            })
            if (notFound) list.push({item: item.category, count: 1})
          }
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
      return {skip: 0, limit: 12}
    }
  },
  changeLimit (to) {
    if (this.pagination.limit !== parseInt(to)) {
      this.loadingShopList = true
      this.pagination.skip = 0
      this.pagination.limit = to
      this.loadPage()
    }
  },
  loadPage () {
    this.loadingShopList = true
    let pagination = this.pagination

    let query = {
      $skip: pagination.skip,
      $limit: pagination.limit,
      listed: true
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

        setTimeout(() => { this.loadingShop = false }, 25)
        this.loadingShopList = false

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
  quantityUp (item) {
    if (typeof item === 'undefined') item = this.viewShopItem
    item.quantity += 1
  },
  quantityDown (item) {
    if (typeof item === 'undefined') item = this.viewShopItem
    if (item.quantity > 0) {
      item.quantity -= 1
    }

    if (item.quantity === 0) {
      this.quantityRemove(item)
    }
  },
  quantityRemove (item) {
    if (typeof item === 'undefined') item = this.viewShopItem
    this.userCart.items.forEach((currentVal, index) => {
      if (currentVal === item) {
        this.userCart.items.splice(index, 1)
      }
    })
    item.addedToCart = false
    item.quantity = 1
  }
})

export default Component.extend({
  tag: 'page-shop',
  ViewModel,
  view
})
