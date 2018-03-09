import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import feathersClient from './feathers-client'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
import behaviors from './behaviors'
import algebra from './algebra'

const Uploads = DefineMap.extend('Uploads', {
  _id: 'any',
  uri: 'string',
  size: 'number'
})

Uploads.List = DefineList.extend({
  '#': Uploads
})

Uploads.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  Map: Uploads,
  List: Uploads.List,
  feathersService: feathersClient.service('uploads'),
  name: 'uploads',
  algebra
})

Uploads.algebra = algebra

export default Uploads
