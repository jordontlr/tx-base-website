import $ from 'jquery'
import callback from 'can-view-callbacks'
import 'bootstrap-tagsinput'

callback.attr('tagsinput', (el) => {
  let $el = $(el)
  let value = el.getAttribute('tagsinput')

  setTimeout(() => {
    $el.tagsinput({
      tagClass: 'label label-primary',
      maxTags: value
    });
  }, 50)
})
