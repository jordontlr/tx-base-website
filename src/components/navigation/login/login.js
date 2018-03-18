import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './login.less'
import view from './login.stache'
import feathersClient from '~/models/feathers-client'
import validate from '~/utils/validators'
import route from 'can-route'
import 'can-route-pushstate'
import Session from '~/models/session'

export const ViewModel = DefineMap.extend({
  loginError: 'boolean',
  emailError: 'string',
  passwordError: 'string',
  session: {
    type: 'any'
  },
  timeFromNow: {
    type: 'any'
  },
  password: {
    type: 'string',
    set (val) {
      this.passwordError = validate.password(val, {allowEmpty: 1})
      return val
    }
  },
  email: {
    type: 'string',
    set (val) {
      this.emailError = validate.email(val, {allowEmpty: 1})
      return val
    }
  },
  passwordVisible: {
    value: false
  },
  processing: 'boolean',
  disableForm: {
    type: 'boolean',
    value: false
  },
  hasErrors: {
    get (val) {
      this.emailError = validate.email(this.email, {allowEmpty: 0})
      this.passwordError = validate.password(this.password, {allowEmpty: 0})
      return this.emailError || this.passwordError
    }
  },
  toggleType () {
    this.passwordVisible = !this.passwordVisible
  },
  handleLogin (ev, email, password) {
    ev.preventDefault()
    if (this.hasErrors) return false
    this.loginError = false
    this.processing = true
    this.disableForm = true

    const session = Session.current
    this.session = session

    feathersClient.authenticate({ strategy: 'local', email: email, password: password })
      .then(({user, tmpPasswordUsed}) => {
        this.processing = false
        session.user = user

        $('#login-modal').modal('hide')

        route.data.set({page: 'dash'}, true)

        this.session.loggedIn = true
        if (tmpPasswordUsed || user.isNewUser) {
          this.session.tmpPassword = password
          $('#set-password-modal').modal('show')
        }
        this.clearForm()
      })
      .catch(() => {
        this.loginError = true
        this.processing = false
        this.disableForm = false
        this.session.loggedIn = false
      })
  },
  clearForm () {
    this.processing = false
    this.loginError = false
    this.disableForm = false
    this.email = null
    this.password = null

    $('#login-modal').modal('hide')
  }
})

export default Component.extend({
  tag: 'login-modal',
  ViewModel,
  view
})
