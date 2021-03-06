import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import connect from 'can-connect'
import feathersClient from './feathers-client'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
import behaviors from './behaviors'
import algebra from './algebra'

const User = DefineMap.extend('User', {
  login (email, password) {
    return feathersClient.authenticate({ strategy: 'local', email, password })
  }
}, {
  _id: 'any',
  email: 'string',
  // We never send password when saving User.
  password: {
    type: 'string',
    serialize: false
  },
  isNewUser: {
    type: 'boolean',
    serialize: false
  },
  setPassword: 'boolean',
  userLocked: {
    type: 'boolean',
    default: false
  },
  isAdmin: 'boolean',
  tmpPasswordTimestampExpiry: 'number',
  signUp (email) {
    return feathersClient.service('users').create({email})
  },
  forgotPassword (email) {
    return feathersClient.service('forgot-password').create({email})
  },
  changePassword (newPassword, oldPassword) {
    return feathersClient.service('users').patch(this._id, {password: newPassword, oldPassword})
  },
  changeEmail (password, newEmail, emailCode) {
    return feathersClient.service('users').patch(this._id, {password, newEmail, emailCode})
  },
  roles: 'string',
  updatedAt: 'date',
  createdAt: 'date'
})

User.List = DefineList.extend('Users', {
  '#': User
})

User.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  Map: User,
  List: User.List,
  feathersService: feathersClient.service('users'),
  name: 'users',
  algebra
})

User.algebra = algebra

export default User
