import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './page-shop.less'
import view from './page-shop.stache'
import Shop from '~/models/shop'

export const ViewModel = DefineMap.extend({
  loadingShop: {
    value: true,
    get (val, resolve) {
      if (!val) { return val }
      this.rowsPromise.then(resolve)
    }
  },
  rowsPromise: {
    value () {
      return Shop.getList()
        .then(shop => {
          this.rows = shop
          this.filteredRows = shop
          setTimeout(() => { this.loadingShop = false }, 25)
        })
        .catch(err => console.log(err))
    }
  },
  rows: {
    Type: Shop.List
  },
  filteredRows: {
    Type: Shop.List
  },
  filterBy: {
    type: 'string'
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
  runFilter () {
    if (this.filterBy !== '') {
      this.filteredRows = this.rows.filter(item => item.category === this.filterBy)
    } else {
      this.filteredRows = this.rows
    }
  }
})

export default Component.extend({
  tag: 'page-shop',
  ViewModel,
  view
})
