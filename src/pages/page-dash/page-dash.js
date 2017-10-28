import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-dash.less'
import view from './page-dash.stache'
import Ticket from '~/models/ticket'

export const ViewModel = DefineMap.extend({
  openTicket: {
    Type: Ticket
  },
  closedTicket: {
    Type: Ticket
  },
  disableForm: {
    value: false
  },
  appState: {
    type: 'any'
  }
})

export default Component.extend({
  tag: 'page-dash',
  ViewModel,
  view,
  events: {
    inserted: function () {
      // todo: get recent tickets
    }
  }
})
