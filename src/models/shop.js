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
    value: null
  },
  category: 'string',
  price: 'number',
  short: {
    type: 'string',
    value: null
  },
  description: 'string',
  delta: {
    type: 'string',
    value: '{"ops":[{"insert":"\\n"}]}'
  },
  content: 'string',
  sku: 'string',
  brand: 'string',
  tags: [ 'string' ],
  imageId: [ 'string' ],
  imageData: {
    serialize: false,
    type: [ 'string' ],
    value () {
      return []
    }
  },
  listed: 'boolean',
  updatedAt: 'date',
  createdAt: 'date',
  quantity: {
    serialize: false,
    type: 'number',
    value: 0
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
  name: 'faq',
  algebra
})

Shop.algebra = algebra

export default Shop
