import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import feathersClient from './feathers-client'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
import behaviors from './behaviors'
import algebra from './algebra'

const Cart = DefineMap.extend('Cart', {
  _id: 'any',
  fingerprint: 'string',
  userId: 'any',

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
