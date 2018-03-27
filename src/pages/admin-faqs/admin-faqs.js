import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './admin-faqs.less'
import view from './admin-faqs.stache'
import Pagination from '~/models/pagination'
import Faq from '~/models/faq'
import Quill from 'quill'

export const ViewModel = DefineMap.extend({
  processing: {
    default: false
  },
  disableForm: {
    default: false
  },
  session: {
    type: 'any'
  },
  loadingFAQs: {
    type: 'boolean',
    default () {
      this.loadPage()
      return true
    }
  },
  rows: {
    Type: Faq.List
  },
  quill: {
    type: 'any'
  },
  pagination: {
    Type: Pagination,
    default () {
      return {skip: 0, limit: 20}
    }
  },
  originalFAQ: {
    Type: Faq,
    default () {
      return new Faq({})
    }
  },
  editFAQ: {
    Type: Faq,
    default () {
      return new Faq({})
    }
  },
  openFAQ (faq) {
    this.editFAQ = new Faq(faq.serialize())
    this.originalFAQ = faq
    this.quill.updateContents(JSON.parse(this.editFAQ.delta))
    $('#editFAQ').modal('show')
  },
  addNew () {
    this.editFAQ = new Faq({})
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
        if (err.code === 401) this.session.error401()
        else console.log(err)
      })
  },
  saveFAQ () {
    this.processing = true
    this.disableForm = true

    this.editFAQ.delta = JSON.stringify(this.quill.getContents())
    this.editFAQ.answer = $('.ql-editor').html()

    let original4Error = new Faq(this.originalFAQ.serialize())

    this.originalFAQ.set(this.editFAQ.serialize())

    this.originalFAQ.save()
      .then(() => {
        this.processing = false
        this.disableForm = false

        this.clearForm()
      })
      .catch(err => {
        this.originalFAQ.set(original4Error.serialize())
        this.processing = false
        this.disableForm = false

        if (err.code === 401) this.session.error401()
        else console.log(err)
      })
  },
  clearForm () {
    this.editFAQ = new Faq({})
    this.originalFAQ = new Faq({})
    this.quill.setContents(JSON.parse('{"ops":[{"insert":"\\n"}]}'))
    $('#editFAQ').modal('hide')
  },
  connectedCallback (el) {
    let toolbarOptions = [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'color': []}, {'background': []}],
      [{'align': []}],
      ['link'],
      ['clean']
    ]

    this.quill = new Quill('#faq-answer', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    })

    return () => {}
  }
})

export default Component.extend({
  tag: 'admin-faqs',
  ViewModel,
  view
})
