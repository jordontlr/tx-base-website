import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './edit-user.less'
import view from './edit-user.stache'
import User from '~/models/user'

export const ViewModel = DefineMap.extend({
  disableForm: {
    type: 'boolean',
    default: false
  },
  processing: {
    type: 'boolean',
    default: false
  },
  editUser: {
    Type: User
  },
  session: {
    type: 'any'
  },
  saveUser () {
    this.processing = true
    this.disableForm = true

    this.editUser.save()
      .then(() => {
        this.processing = false
        this.disableForm = false

        $('#EditUser').modal('hide')
      })
      .catch(err => {
        this.processing = false
        this.disableForm = false

        if (err.code === 401) this.session.error401()
        else console.log(err)
      })
  }
})

export default Component.extend({
  tag: 'edit-user',
  ViewModel,
  view
})
