import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-home.less'
import view from './page-home.stache'

export const ViewModel = DefineMap.extend({
  message: {
    default: 'This is the page-home component'
  }
})

export default Component.extend({
  tag: 'page-home',
  ViewModel,
  view
})
