import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './admin-shop.less'
import view from './admin-shop.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the admin-shop component'
  }
})

export default Component.extend({
  tag: 'admin-shop',
  ViewModel,
  view
})
