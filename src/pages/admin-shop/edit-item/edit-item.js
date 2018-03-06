import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './edit-item.less'
import view from './edit-item.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the edit-item component'
  }
})

export default Component.extend({
  tag: 'edit-item',
  ViewModel,
  view
})
