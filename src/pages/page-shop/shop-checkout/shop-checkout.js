import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './shop-checkout.less'
import view from './shop-checkout.stache'
import $ from 'jquery'
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
  checkout () {

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
    if (this.paymentConfig.paypal && window.paypal) {
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
          this.userCart.initiatedPayment = true
          this.userCart.paymentType = 'paypal'

          return this.userCart
            .save()
            .then(data => {
              console.log('payment:', data)
              return data.payPal.paymentID
            })
        },
        onAuthorize: (data) => {
          this.userCart.paymentProcessId = data.paymentID
          this.userCart.paymentClientId = data.payerID

          return this.userCart
            .save()
            .then(data => {
              console.log('Authorized:', data)
              return data.payPal.paymentID
            })
        },
        onCancel: () => {
          this.userCart.initiatedPayment = false
          return this.userCart.save()
        },
        onError: (err) => {
          this.userCart.initiatedPayment = false
          this.userCart.save()
          console.log(err)
        }
      }, '#paypal-button')
    }
    // end paypal

    // start stripe
    if (this.paymentConfig.stripe) {

    }
    // end stripe

    return () => {}
  }
})

export default Component.extend({
  tag: 'shop-checkout',
  ViewModel,
  view
})
