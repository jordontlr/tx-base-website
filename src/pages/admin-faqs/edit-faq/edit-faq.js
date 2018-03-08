import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './edit-faq.less'
import view from './edit-faq.stache'
import Faq from '~/models/faq'

export const ViewModel = DefineMap.extend({
  disableForm: {
    value: false
  },
  processing: 'boolean',
  editFAQ: {
    Type: Faq
  },
  session: {
    type: 'any'
  },
  saveFAQ () {
    this.processing = true
    this.disableForm = true

    this.editFAQ.save()
      .then(() => {
        this.processing = false
        this.disableForm = false

        $('#editFAQ').modal('hide')

        this.editFAQ = new Faq()
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
  tag: 'edit-faq',
  ViewModel,
  view
})
