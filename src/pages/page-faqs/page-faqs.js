import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-faqs.less'
import view from './page-faqs.stache'
import Faq from '~/models/faq'

export const ViewModel = DefineMap.extend({
  loadingFAQs: {
    default: true,
    get (val, resolve) {
      if (!val) { return val }
      this.rowsPromise.then(resolve)
    }
  },
  rowsPromise: {
    default () {
      return Faq.getList()
        .then(faqs => {
          this.rows = faqs
          this.filteredRows = faqs
          setTimeout(() => { this.loadingFAQs = false }, 25)
        })
        .catch(err => console.log(err))
    }
  },
  rows: {
    Type: Faq.List,
    default () {
      return []
    }
  },
  filteredRows: {
    Type: Faq.List
  },
  filterBy: {
    type: 'string'
  },
  hasCategories: {
    default () {
      return this.rows.filter(item => item.category && String(item.category).trim() !== '' && typeof item.category !== 'undefined').length
    }
  },
  categories: {
    default () {
      return this.rows.reduce((list, item) => {
        if (item.category && String(item.category).trim() !== '' && typeof item.category !== 'undefined' && !list.includes(item.category)) list.push(item.category)
        return list
      }, [])
    }
  },
  runFilter () {
    if (this.filterBy !== '') {
      this.filteredRows = this.rows.filter(item => item.category === this.filterBy)
    } else {
      this.filteredRows = this.rows
    }
  }
})

export default Component.extend({
  tag: 'page-faqs',
  ViewModel,
  view
})
