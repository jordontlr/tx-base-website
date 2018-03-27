import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './shop-checkout.less'
import view from './shop-checkout.stache'
import Cart from '~/models/cart'
import $ from 'jquery'
import * as Cookie from 'js-cookie'
import loader from '@loader'

export const ViewModel = DefineMap.extend({
  userCart: {
    type: 'any'
  },
  disableForm: {
    default: false
  },
  processing: {
    default: false
  },
  paymentConfig: {
    default () {
      return loader.payments
    }
  },
  quantityUp (item) {
    if (typeof item === 'undefined') item = this.viewShopItem
    item.quantity += 1
    this.updateCartAPI()
  },
  quantityDown (item) {
    if (typeof item === 'undefined') item = this.viewShopItem
    if (item.quantity > 0) {
      item.quantity -= 1
    }

    if (item.quantity === 0) {
      this.quantityRemove(item)
    }
    this.updateCartAPI()
  },
  quantityRemove (item) {
    if (typeof item === 'undefined') item = this.viewShopItem
    this.userCart.items.forEach((currentVal, index) => {
      if (currentVal === item) {
        this.userCart.items.splice(index, 1)
      }
    })
    item.addedToCart = false
    item.quantity = 1

    if (this.userCart.items.length === 0) {
      $('#checkout-details').modal('hide')
    }

    this.updateCartAPI()
  },
  updateCartAPI () {
    this.userCart.save()
  },
  connectedCallback (el) {
    // start paypal
    if (this.paymentConfig.paypal) {
      let payPalBtn = setInterval(() => {
        if (typeof window.paypal !== 'undefined') {
          window.paypal.Button.render({
            env: 'sandbox', // Or 'production',
            commit: true,
            style: {
              color: 'blue',
              size: 'medium',
              shape: 'rect',
              tagline: false
            },
            payment: () => {
              this.userCart.paymentInitiated = true
              this.userCart.paymentType = 'paypal'

              return this.userCart
                .save()
                .then(data => {
                  return data.payPal.paymentID
                })
            },
            onAuthorize: (data) => {
              this.userCart.payPal = data

              this.userCart
                .save()
                .then(data => {
                  Cookie.remove('cartId')
                  this.userCart = new Cart({})
                  $('#checkout-details').modal('hide')
                })
            },
            onCancel: () => {
              this.userCart.paymentInitiated = false
              this.userCart.paymentAuthorized = false
              return this.userCart.save()
            },
            onError: (err) => {
              this.userCart.paymentInitiated = false
              this.userCart.paymentAuthorized = false
              this.userCart.save()
              console.log(err)
            }
          }, '#paypal-button')

          clearInterval(payPalBtn)
        }
      }, 500)
    }
    // end paypal

    // start stripe
    let stripFunction = null
    if (this.paymentConfig.stripe) {
      let stripIntegration = setInterval(() => {
        if (typeof window.StripeCheckout !== 'undefined') {
          let handler = window.StripeCheckout.configure({
            key: 'pk_test_j3aZnOel1pwJ00ejLkDpelNv',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function (token) {
              this.userCart.stripe = { token }
              this.userCart.paymentInitiated = true
              this.userCart.paymentType = 'stripe'

              return this.userCart.save()
            }
          })

          stripFunction = e => {
            // Open Checkout with further options:
            handler.open({
              name: this.paymentConfig.company,
              description: '',
              currency: this.paymentConfig.currency,
              amount: (this.userCart.cartTotal * 100)
            })
            e.preventDefault()
          }

          $('body').on('click', '#customButton', stripFunction)

          clearInterval(stripIntegration)
        }
      }, 500)
    }
    // end stripe

    return () => {
      if (this.paymentConfig.stripe && typeof stripFunction === 'function') {
        $('body').off('click', '#customButton', stripFunction)
      }
    }
  }
})

export default Component.extend({
  tag: 'shop-checkout',
  ViewModel,
  view
})
