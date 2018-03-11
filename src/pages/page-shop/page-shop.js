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
  sortType: {
    value: 'Name'
  },
  sortDirection: {
    value: 'down'
  },
  changeSortDirection () {
    if (this.sortDirection === 'down') this.sortDirection = 'up'
    else this.sortDirection = 'down'
  },
  displayType: {
    value: 'large'
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
  hasCategories: {
    value () {
      return this.rows.filter(item => item.category !== '' && typeof item.category !== 'undefined').length
    }
  },
  categories: {
    value () {
      return this.rows.reduce((list, item) => {
        if (item.category !== '' && typeof item.category !== 'undefined' && !list.includes(item.category)) list.push(item.category)
        return list
      }, [])
    }
  },
  pagination: {
    Type: Pagination,
    value () {
      return {skip: 0, limit: 2}
    }
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

    return Shop.getList(query)
      .then(shop => {
        this.rows = shop
        this.pagination.total = shop.total
        setTimeout(() => { this.loadingShop = false }, 25)
      })
      .catch(err => console.log(err))
  }
})

export default Component.extend({
  tag: 'page-shop',
  ViewModel,
  view
})
