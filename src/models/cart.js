import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import feathersClient from './feathers-client'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
import behaviors from './behaviors'
import algebra from './algebra'
import Shop from './shop'

const Cart = DefineMap.extend('Cart', {
  _id: 'any',
  fingerprint: 'string',
  userId: 'any',
  paymentInitiated: {
    type: 'boolean',
    default: false
  },
  paymentAuthorized: 'boolean',
  paymentComplete: 'boolean',
  paymentType: 'string',
  payPal: {
    type: { paymentId: 'string', payerId: 'number' }
  },
  public: 'boolean',
  items: {
    serialize: false,
    Type: Shop.List,
    default () {
      return []
    }
  },
  cartTotal: {
    serialize: false,
    get (val) {
      return this.items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total || 0
      }, 0)
    }
  },
  cartItems: {
    serialize: true,
    type: [ { itemId: 'string', quantity: 'number' } ],
    get (val) {
      return this.items.reduce((list, item) => {
        list.push({ itemId: item._id, quantity: item.quantity })
        return list
      }, [])
    },
    set (newVal) {
      return newVal.reduce((list, item) => {
        this.cartItemsToLoad.push({ itemId: item.itemId, quantity: item.quantity })
        return list
      }, [])
    }
  },
  cartItemsToLoad: {
    serialize: false,
    type: [ { itemId: 'string', quantity: 'number' } ],
    default () {
      return []
    }
  },
  updatedAt: 'date',
  createdAt: 'date'
})

Cart.List = DefineList.extend({
  '#': Cart
})

Cart.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  Map: Cart,
  List: Cart.List,
  feathersService: feathersClient.service('cart'),
  name: 'cart',
  algebra
})

Cart.algebra = algebra

export default Cart
