import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-shop.less'
import view from './page-shop.stache'
import Pagination from '~/models/pagination'
import Shop from '~/models/shop'
import Cart from '~/models/cart'
import Fingerprint2 from 'fingerprintjs2'
import * as Cookie from 'js-cookie'

export const ViewModel = DefineMap.extend({
  viewShopItem: {
    Type: Shop,
    default () {
      return new Shop({})
    }
  },
  userCart: {
    Type: Cart,
    default () {
      return new Cart({})
    }
  },
  addToCart (item) {
    if (!this.userCart.fingerprint) {
      new Fingerprint2().get((result) => {
        this.userCart.fingerprint = result
      })
    }
    if (this.session && this.session.loggedIn) {
      this.userCart.userId = this.session.user._id
    }

    let found = false
    this.userCart.items.forEach((currentVal) => {
      if (currentVal === item) {
        currentVal.quantity += 1
        currentVal.addedToCart = true
        found = true
      }
    })
    if (!found) {
      if (item.quantity === 0) item.quantity = 1
      item.addedToCart = true
      this.userCart.items.push(item)
    }
    this.updateCartAPI()
  },
  loadingShop: {
    type: 'boolean',
    default: true,
    get (val) {
      this.loadPage()
      return val
    }
  },
  loadingShopList: {
    type: 'boolean',
    default: false
  },
  filterTags: {
    type: 'string',
    default: null
  },
  changeTags (to) {
    this.loadingShopList = true
    this.pagination.skip = 0
    this.filterTags = to
    this.filterCategory = null
    $('#view-item-details').modal('hide')
    this.loadPage()
  },
  clearFilterTags () {
    this.loadingShopList = true
    this.filterTags = null
    this.loadPage(true)
  },
  filterCategory: {
    type: 'string',
    default: null
  },
  changeCategory (to) {
    this.loadingShopList = true
    this.pagination.skip = 0
    if (this.filterCategory !== to) this.filterCategory = to
    else this.filterCategory = null
    this.loadPage()
  },
  sortType: {
    type: 'string',
    default: 'product'
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
    type: 'string',
    default: 'down'
  },
  changeSortDirection () {
    this.loadingShopList = true
    this.pagination.skip = 0
    if (this.sortDirection === 'down') this.sortDirection = 'up'
    else this.sortDirection = 'down'
    this.loadPage()
  },
  displayType: {
    type: 'string',
    default: 'list'
  },
  changeDisplayType (to) {
    this.displayType = to
  },
  rows: {
    Type: Shop.List,
    default () {
      return []
    }
  },
  allCategories: {
    Type: Shop.List,
    default () {
      return []
    }
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
    default () {
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

        Shop.getList({ $select: [ 'category' ], $sort: { category: 1 } })
          .then(shopCategories => {
            this.allCategories = shopCategories
          })

        let cartCookie = Cookie.get('cartId')
        if (!this.userCart._id && cartCookie) {
          this.userCart = Cart
            .get({_id: cartCookie})
            .then(data => {
              this.userCart = data
              // todo: check to make sure list matches available items and populate items list in cart model (I think this is working but needs testing)
              this.userCart.cartItemsToLoad.forEach((cartItem) => {
                let foundItem = false
                this.rows.forEach((shopItem) => {
                  if (!foundItem && cartItem.itemId === shopItem._id) {
                    shopItem.quantity = cartItem.quantity
                    shopItem.addedToCart = true
                    this.userCart.items.push(shopItem)
                    foundItem = true
                  }
                })
              })
            })
        }
      })
      .catch(err => console.log(err))
  },
  openShopModal (shopItem) {
    this.viewShopItem = shopItem

    $('#view-item-details').modal('show')
  },
  closeModal () {
    $('#view-item-details').modal('hide')
  },
  quantityUp (item) {
    if (typeof item === 'undefined') item = this.viewShopItem
    item.quantity += 1
    this.updateCartAPI()
  },
  quantityDown (item) {
    if (typeof item === 'undefined') item = this.viewShopItem
    if (item.quantity > 0) {
      item.quantity -= 1
    }

    if (item.quantity === 0) {
      this.quantityRemove(item)
    }
    this.updateCartAPI()
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
    this.updateCartAPI()
  },
  updateCartAPI () {
    this.userCart.save()
      .then(data => {
        Cookie.set('cartId', data._id, { expires: 30 })
      })
  },
  checkout () {
    $('#checkout-details').modal('show')
  }
})

export default Component.extend({
  tag: 'page-shop',
  ViewModel,
  view
})
