import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import feathersClient from './feathers-client'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
import behaviors from './behaviors'
import algebra from './algebra'

const Profile = DefineMap.extend('Profile', {
  _id: 'any',
  first: 'string',
  last: 'string',
  image: 'string',
  gender: 'string',
  dayOfBirth: 'number',
  monthOfBirth: 'number',
  yearOfBirth: 'number',
  updatedAt: 'number',
  createdAt: 'number'
})

Profile.List = DefineList.extend({
  '#': Profile
})

Profile.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  Map: Profile,
  List: Profile.List,
  feathersService: feathersClient.service('faq'),
  name: 'faq',
  algebra
})

Profile.algebra = algebra

export default Profile
