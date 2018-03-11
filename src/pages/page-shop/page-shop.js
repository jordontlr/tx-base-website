import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-shop.less'
import view from './page-shop.stache'
import Pagination from '~/models/pagination'
import Shop from '~/models/shop'

export const ViewModel = DefineMap.extend({
  loadingShop: {
    value: true,
    get (val, resolve) {
      if (!val) { return val }
      this.rowsPromise.then(resolve)
    }
  },
  filterCategory: 'string',
  changeCategory (to) {
    if (this.filterCategory !== to) this.filterCategory = to
    else this.filterCategory = null
    this.loadPage()
  },
  sortType: {
    value: 'product'
  },
  changeSortType (to) {
    this.sortType = to
    this.loadPage()
  },
  sortDirection: {
    value: 'down'
  },
  changeSortDirection () {
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
  loadPage () {
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

        Shop.getList()
          .then(shop => {
            this.allCategories = shop
          })
      })
      .catch(err => console.log(err))
  }
})

export default Component.extend({
  tag: 'page-shop',
  ViewModel,
  view
})
