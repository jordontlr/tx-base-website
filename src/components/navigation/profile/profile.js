import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import './profile.less'
import view from './profile.stache'
import monthsData from './data/months'
import 'bootstrap-select'
import User from '~/models/user'
// import Profile from '~/models/profile'

export const ViewModel = DefineMap.extend({
  startYear: {
    value: 1940
  },
  countYears: {
    value: 77
  },
  dropDownSize: {
    value: 12
  },
  currentUser: {
    Type: User
  },
  session: {
    type: 'any'
  },
  monthsList: {
    Type: DefineList,
    value () {
      return monthsData
    }
  },
  daysOfMonthList: {
    get () {
      return new DefineList(new Array(31).fill(0).map((v, i) => i + 1))
    }
  },
  yearsList: {
    get () {
      return new DefineList(new Array(this.countYears).fill(0).map((v, i) => i + this.startYear))
    }
  },
  disableForm: 'boolean',
  processing: 'boolean',
  firstName: 'string',
  firstNameError: 'string',
  lastName: 'string',
  gender: 'string',
  dayOfBirth: 'number',
  monthOfBirth: 'number',
  yearOfBirth: 'number',
  dayOfBirthString: {
    get () {
      let s = '0' + this.dayOfBirth
      return s.substr(s.length - 2)
    }
  },
  monthOfBirthString: {
    get () {
      let s = '0' + this.monthOfBirth
      return s.substr(s.length - 2)
    }
  },
  clearForm () {
    this.processing = false
    this.disableForm = false
    this.firstName = null
    this.lastName = null
    this.gender = null
    this.dayOfBirth = 1
    this.monthOfBirth = 1
    this.yearOfBirth = this.startYear
    $('.bootstrap-select').trigger('reset-select-picker')
    $('#profile-modal').modal('hide')
  },
  save () {
    console.log('here')
  }
})

export default Component.extend({
  tag: 'profile-modal',
  ViewModel,
  view
})
