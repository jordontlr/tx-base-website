import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './count-down.less'
import view from './count-down.stache'
import moment from 'moment'

export const ViewModel = DefineMap.extend({
  countdown: {
    default: false
  },
  showLabels: {
    default: false
  },
  showZeros: {
    default: false
  },
  loaded: {
    type: 'boolean',
    get (val) {
      let startInterval = setInterval(() => {
        if (typeof this.timestamp !== 'undefined' && typeof this.current !== 'undefined') {
          clearInterval(startInterval)
          let eventTime = this.timestamp
          let currentTime = this.current
          let timeOffset = this.current - Math.floor(Date.now())
          let diffTime = eventTime - currentTime
          let duration = moment.duration(diffTime, 'milliseconds')
          let interval = 1000

          if (diffTime > 0) {
            let countdownInterval = setInterval(() => {
              currentTime = Math.floor(Date.now()) + timeOffset
              diffTime = eventTime - currentTime
              duration = moment.duration(diffTime, 'milliseconds')

              duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds')

              if (duration._milliseconds >= 0) {
                let o = moment.duration(duration).months()
                let d = moment.duration(duration).days()
                let h = moment.duration(duration).hours()
                let m = moment.duration(duration).minutes()
                let s = moment.duration(duration).seconds()

                if (this.showZeros) {
                  o = $.trim(o).length === 1 ? '0' + o : o
                  d = $.trim(d).length === 1 ? '0' + d : d
                  h = $.trim(h).length === 1 ? '0' + h : h
                  m = $.trim(m).length === 1 ? '0' + m : m
                  s = $.trim(s).length === 1 ? '0' + s : s
                }

                this.months = o
                this.days = d
                this.hours = h
                this.minutes = m
                this.seconds = s

                this.loaded = true
              } else {
                this.countdown = true
                clearInterval(countdownInterval)
              }
            }, interval)
          } else {
            this.countdown = true
            this.loaded = true
          }

          return true
        }
      }, 50)
      return false
    }
  },
  months: {
    default: '00'
  },
  days: {
    default: '00'
  },
  hours: {
    default: '00'
  },
  minutes: {
    default: '00'
  },
  seconds: {
    default: '00'
  },
  hasMonths: {
    get () {
      return parseInt(this.months)
    }
  },
  hasDays: {
    get () {
      return parseInt(this.days) || parseInt(this.months)
    }
  },
  hasHours: {
    get () {
      return parseInt(this.hours) || parseInt(this.days) || parseInt(this.months)
    }
  },
  hasMinutes: {
    get () {
      return parseInt(this.minutes) || parseInt(this.hours) || parseInt(this.days) || parseInt(this.months)
    }
  },
  hasSeconds: {
    get () {
      return parseInt(this.seconds) || parseInt(this.minutes) || parseInt(this.hours) || parseInt(this.days) || parseInt(this.months)
    }
  },
  manyMonths: {
    get () {
      return (parseInt(this.months) > 1)
    }
  },
  manyDays: {
    get () {
      return (parseInt(this.days) > 1)
    }
  },
  manyHours: {
    get () {
      return (parseInt(this.hours) > 1)
    }
  },
  manyMinutes: {
    get () {
      return (parseInt(this.minutes) > 1)
    }
  },
  manySeconds: {
    get () {
      return (parseInt(this.seconds) > 1)
    }
  },
  yearProgress: {
    get () {
      return (parseInt(this.months) / 12) * 100
    }
  },
  monthProgress: {
    get () {
      return (parseInt(this.days) / 30) * 100
    }
  },
  dayProgress: {
    get () {
      return (parseInt(this.hours) / 24) * 100
    }
  },
  hourProgress: {
    get () {
      return (parseInt(this.minutes) / 60) * 100
    }
  },
  minuteProgress: {
    get () {
      return (parseInt(this.seconds) / 60) * 100
    }
  }
})

export default Component.extend({
  tag: 'count-down',
  ViewModel,
  view
})
