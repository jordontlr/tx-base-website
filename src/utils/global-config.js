import $ from 'jquery'
import loader from '@loader'

if (loader.analytics.gooogle) {
  $.getScript('//www.google-analytics.com/global-config.js')

  window.ga = window.ga || function () {
    (window.ga.q = window.ga.q || []).push(arguments)
  }
  window.ga.l = +new Date()
  window.ga('create', loader.analytics.gooogle, 'auto')
  window.ga('send', 'pageview')
}

function trackEvent (category, action) {
  if (loader.analytics.gooogle) window.ga('send', 'event', category, action)
}

function trackPage (path, title) {
  if (loader.analytics.gooogle) {
    window.ga('set', { page: path, title: title })
    window.ga('send', 'pageview')
  }
}

if (loader.payments.paypal) $.getScript('//www.paypalobjects.com/api/checkout.js')
if (loader.payments.stripe) $.getScript('//checkout.stripe.com/checkout.js')

export { trackEvent }
export { trackPage }
