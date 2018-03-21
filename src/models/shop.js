import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import feathersClient from './feathers-client'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
import behaviors from './behaviors'
import algebra from './algebra'

const Shop = DefineMap.extend('Shop', {
  _id: 'any',
  product: {
    type: 'string',
    default: null
  },
  category: 'string',
  price: 'number',
  short: {
    type: 'string',
    default: null
  },
  description: 'string',
  delta: {
    type: 'string',
    default: '{"ops":[{"insert":"\\n"}]}'
  },
  content: 'string',
  sku: 'string',
  brand: 'string',
  tags: [ 'string' ],
  imageData: {
    type: [ 'string' ],
    default () {
      return []
    }
  },
  listed: 'boolean',
  updatedAt: 'date',
  createdAt: 'date',
  quantity: {
    serialize: false,
    type: 'number',
    default: 1
  },
  addedToCart: {
    serialize: false,
    type: 'boolean',
    default: false
  },
  total: {
    serialize: false,
    get (val) {
      val = this.quantity * this.price

      return val
    }
  }
})

Shop.List = DefineList.extend({
  '#': Shop
})

Shop.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  Map: Shop,
  List: Shop.List,
  feathersService: feathersClient.service('shop'),
  name: 'shop',
  algebra
})

Shop.algebra = algebra

export default Shop
