import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './edit-item.less'
import view from './edit-item.stache'
import Shop from '~/models/shop'

export const ViewModel = DefineMap.extend({
  disableForm: {
    value: false
  },
  processing: 'boolean',
  editShopItem: {
    Type: Shop
  },
  session: {
    type: 'any'
  },
  saveShopItem () {
    this.processing = true
    this.disableForm = true

    this.editShopItem.save()
      .then(() => {
        this.processing = false
        this.disableForm = false

        $('#editShopItem').modal('hide')

        this.editShopItem = new Shop()
      })
      .catch(err => {
        this.processing = false
        this.disableForm = false

        if (err.status === 401) this.session.error401()
        else console.log(err)
      })
  }
})

export default Component.extend({
  tag: 'edit-item',
  ViewModel,
  view
})
