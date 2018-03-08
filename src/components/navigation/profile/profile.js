import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import './profile.less'
import view from './profile.stache'
import monthsData from './data/months'
import 'bootstrap-select'
import Profile from '~/models/profile'

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
  loadingProfile: {
    type: 'boolean',
    value: true,
    get () {
      this.loadPage()
    }
  },
  session: {
    type: 'any'
  },
  currentProfile: {
    Type: Profile
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
    $('.bootstrap-select').trigger('reset-select-picker')
    $('#profile-modal').modal('hide')
  },
  save () {
    this.currentProfile.save()
      .then(() => {
        this.processing = false
        this.disableForm = false

        $('#profile-modal').modal('hide')
      })
      .catch(err => {
        this.disableForm = false
        this.processing = false

        if (err.code === 401) this.session.error401()
        else console.log(err)
      })
  },
  loadPage () {
    this.loadingProfile = true
    Profile.getList()
      .then(profile => {
        if (profile.length < 1) this.currentProfile = new Profile({})
        else this.currentProfile = profile[0]
        setTimeout(() => { this.loadingProfile = false }, 25)
      })
      .catch(err => {
        if (err.code === 401) this.session.error401()
        else if (err.code === 404) this.currentProfile = new Profile({})
        else console.log(err)
      })

  }
})

export default Component.extend({
  tag: 'profile-modal',
  ViewModel,
  view
})
