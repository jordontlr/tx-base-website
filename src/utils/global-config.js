import $ from 'jquery'
import loader from '@loader'

let functions = {}

if (loader.analytics.gooogle) {
  $.getScript('//www.google-analytics.com/global-config.js')

  window.ga = window.ga || function () {
    (window.ga.q = window.ga.q || []).push(arguments)
  }
  window.ga.l = +new Date()
  window.ga('create', loader.analytics.gooogle, 'auto')
  window.ga('send', 'pageview')

  Object.assign(functions, {
    trackEvent: (category, action) => {
      window.ga('send', 'event', category, action)
    }
  })
}

if (loader.payments.paypal) $.getScript('//www.paypalobjects.com/api/checkout.js')
if (loader.payments.stripe) $.getScript('')

export default functions
