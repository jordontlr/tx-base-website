import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import feathersClient from './feathers-client'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
import behaviors from './behaviors'
import algebra from './algebra'

const Image = DefineMap.extend('Image', {
  _id: 'any',
  uri: 'string',
  userId: 'any',
  updatedAt: 'date',
  createdAt: 'date'
})

Image.List = DefineList.extend({
  '#': Image
})

Image.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  Map: Image,
  List: Image.List,
  feathersService: feathersClient.service('image'),
  name: 'image',
  algebra
})

Image.algebra = algebra

export default Image
