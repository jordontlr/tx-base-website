import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './set-password.less'
import view from './set-password.stache'
import validate from '~/utils/validators'

export const ViewModel = DefineMap.extend({
  session: {
    type: 'any',
    set (val) {
      const user = val && val.user
      if (user.setPassword) {
        setTimeout(() => $('#set-password-modal').modal('show'), 300)
      }
      return val
    }
  },
  changeError: 'boolean',
  changeErrorSamePassword: 'boolean',
  processing: 'boolean',
  passwordError: 'string',
  disableForm: {
    default: false
  },
  password: {
    type: 'string',
    set (value) {
      this.passwordError = validate.password(value, {allowEmpty: 1})
      return value
    }
  },
  passwordVisible: 'boolean',
  hasErrors: {
    get () {
      this.passwordError = validate.password(this.password, {allowEmpty: 0})
      return this.passwordError
    }
  },
  updatePassword (el) {
    this.password = el.value
  },
  toggleType () {
    this.passwordVisible = !this.passwordVisible
  },
  handleSetPassword (ev, password) {
    ev.preventDefault()
    if (this.hasErrors) return false
    this.changeError = false
    this.changeErrorSamePassword = false
    this.processing = true
    this.disableForm = true

    if (String(password) !== String(this.session.tmpPassword)) {
      this.session.user.changePassword(password, this.session.tmpPassword)
        .then(() => {
          this.processing = false
          this.changeError = false
          this.changeErrorSamePassword = false
          this.disableForm = false
          this.password = null

          delete this.session.tmpPassword

          $('#set-password-modal').modal('hide')
        })
        .catch(err => {
          this.disableForm = false
          this.processing = false
          this.changeError = true
          this.changeErrorSamePassword = false

          if (err.code === 401) this.session.error401()
          else console.log(err)
        })
    } else {
      this.changeErrorSamePassword = true
      this.disableForm = false
      this.processing = false
    }
  }
})

export default Component.extend({
  tag: 'set-password-modal',
  ViewModel,
  view
})
