import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-dash.less'
import view from './page-dash.stache'

export const ViewModel = DefineMap.extend({
  disableForm: {
    default: false
  },
  session: {
    type: 'any'
  }
})

export default Component.extend({
  tag: 'page-dash',
  ViewModel,
  view
})
