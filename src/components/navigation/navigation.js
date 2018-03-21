import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './navigation.less'
import view from './navigation.stache'
import route from 'can-route'
import 'can-route-pushstate'

export const ViewModel = DefineMap.extend({
  listenerAdded: {
    default: false
  },
  session: {
    type: 'any'
  },
  page: {
    type: 'any'
  },
  email: {
    type: 'string',
    default () {
      if (this.session.user) {
        return this.session.user.email
      } else {
        return 'User Menu'
      }
    }
  },
  closeMenu () {
    if ($('.navbar-toggle').is(':visible') && $('.navbar-collapse').hasClass('in')) {
      $('.navbar-toggle').trigger('click')
      setTimeout(() => $('html, body').animate({scrollTop: 0}, 'fast'), 25)
    }
  },
  logout () {
    this.closeMenu()
    this.session.logout()
    route.data.set({page: 'home'}, true)
  }
})

export default Component.extend({
  tag: 'navigation-bar',
  ViewModel,
  view
})
