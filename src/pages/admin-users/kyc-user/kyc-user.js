import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './kyc-user.less'
import view from './kyc-user.stache'
import User from '~/models/user'
import Kyc from '~/models/kyc'
import '~/models/fixtures/kyc'

export const ViewModel = DefineMap.extend({
  disableForm: {
    type: 'boolean',
    default: false
  },
  processing: {
    type: 'boolean',
    default: false
  },
  kyc: {
    Type: Kyc
  },
  editUser: {
    Type: User
  },
  session: {
    type: 'any'
  }
})

export default Component.extend({
  tag: 'kyc-user',
  ViewModel,
  view
})
