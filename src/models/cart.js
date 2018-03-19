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
  items: {
    serialize: false,
    Type: Shop.List,
    value () {
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
    type: [ { itemId: 'string', quantity: 'number' } ],
    get (val) {
      return this.items.reduce((list, item) => {
        list.push({ itemId: item._id, quantity: item.quantity })
        console.log(list)
        return list
      }, [])
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
