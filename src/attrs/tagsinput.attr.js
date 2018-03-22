import $ from 'jquery'
import 'bootstrap-tagsinput'
import callback from 'can-view-callbacks'

callback.attr('tagsinput', (el) => {
  let $el = $(el)
  let value = el.getAttribute('tagsinput')

  setTimeout(() => {
    $el.tagsinput({
      tagClass: 'label label-primary',
      maxTags: value
    })
  }, 250)
})
