import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './admin-shop.less'
import view from './admin-shop.stache'
import Pagination from '~/models/pagination'
import Shop from '~/models/shop'

export const ViewModel = DefineMap.extend({
  session: {
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
    value: new Shop()
  },
  openShopItem (shop) {
    this.editShopItem = shop
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
        if (err.status === 401) this.session.error401()
        else console.log(err)
      })
  }
})

export default Component.extend({
  tag: 'admin-shop',
  ViewModel,
  view
})
