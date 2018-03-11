import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import feathersClient from './feathers-client'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
import behaviors from './behaviors'
import algebra from './algebra'

const Shop = DefineMap.extend('Shop', {
  _id: 'any',
  product: 'string',
  category: 'string',
  price: 'number',
  short: 'string',
  description: 'string',
  content: 'string',
  sku: 'string',
  brand: 'string',
  imageId: [ 'string' ],
  listed: 'boolean',
  updatedAt: 'date',
  createdAt: 'date'
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
