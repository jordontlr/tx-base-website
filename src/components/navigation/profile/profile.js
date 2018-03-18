import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import './profile.less'
import view from './profile.stache'
import monthsData from './data/months'
import countryData from './data/country'
import 'bootstrap-select'
import Profile from '~/models/profile'
import Uploads from '~/models/uploads'

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
    value () {
      this.loadPage()
      return true
    }
  },
  session: {
    type: 'any'
  },
  currentProfile: {
    Type: Profile
  },
  countryList: {
    Type: DefineList,
    value () {
      return countryData
    }
  },
  monthsList: {
    Type: DefineList,
    value () {
      return monthsData
    }
  },
  daysOfMonthList: {
    get (val) {
      return new DefineList(new Array(31).fill(0).map((v, i) => i + 1))
    }
  },
  yearsList: {
    get (val) {
      return new DefineList(new Array(this.countYears).fill(0).map((v, i) => i + this.startYear))
    }
  },
  countryListSearch: {
    get (val) {
      return (this.countryList.length > this.dropDownSize)
    }
  },
  disableForm: 'boolean',
  processing: 'boolean',
  dayOfBirthString: {
    get (val) {
      let s = '0' + this.dayOfBirth
      return s.substr(s.length - 2)
    }
  },
  monthOfBirthString: {
    get (val) {
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
    let $cropit = $('#image-cropper')
    $cropit.trigger('get-data')

    let imageData = $cropit.attr('data-image-data')

    if (imageData !== 'undefined') {
      let sendObj = {
        uri: imageData
      }

      let imageUpload = new Uploads(sendObj)

      imageUpload
        .save()
        .then(imageInfo => {
          this.currentProfile.imageId = imageInfo._id
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
        })
    } else {
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
    }
  },
  loadPage () {
    this.loadingProfile = true
    Profile.getList()
      .then(profile => {
        if (profile.length < 1) this.currentProfile = new Profile({})
        else this.currentProfile = profile[0]

        if (this.currentProfile.imageId !== 'undefined' && this.currentProfile.imageId !== '' && this.currentProfile.imageId) {
          Uploads
            .get({ _id: this.currentProfile.imageId })
            .then(imageData => {
              $('#image-cropper').attr('data-current-image', imageData.uri)
            })
        }

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
