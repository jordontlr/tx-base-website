import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './admin-faqs.less'
import view from './admin-faqs.stache'
import Pagination from '~/models/pagination'
import Faq from '~/models/faq'
import '~/models/fixtures/faq'

export const ViewModel = DefineMap.extend({
  session: {
    type: 'any'
  },
  loadingFAQs: {
    type: 'boolean',
    value: true
  },
  rows: {
    Type: Faq.List
  },
  pagination: {
    Type: Pagination,
    value () {
      return {skip: 0, limit: 10}
    }
  },
  editFAQ: {
    Type: Faq,
    value: new Faq()
  },
  openFAQ (faq) {
    this.editFAQ = faq
    $('#editFAQ').modal('show')
  },
  deleteFAQ (faq) {
    // todo: maybe add an "are you sure" question
    faq.destroy()
  },
  loadPage () {
    this.loadingFAQs = true
    let pagination = this.pagination
    Faq.getList({$skip: pagination.skip, $limit: pagination.limit})
      .then(faqs => {
        this.rows = faqs
        this.pagination.total = faqs.total
        setTimeout(() => { this.loadingFAQs = false }, 25)
      })
      .catch(err => {
        if (err.status === 401) this.session.error401()
        else console.log(err)
      })
  }
})

export default Component.extend({
  tag: 'admin-faqs',
  ViewModel,
  view,
  events: {
    inserted: function () {
      this.viewModel.loadPage()
    }
  }
})
