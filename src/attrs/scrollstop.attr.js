import $ from 'jquery'
import callback from 'can-view-callbacks'

callback.attr('modal-scrollstop', function (el) {
  let $el = $(el)

  $el.on('wheel', function (e) {
    let $this = $(this)
    if ($this.innerHeight() !== $this[0].scrollHeight) {
      if (e.originalEvent.deltaY < 0) {
        /* scrolling up */
        return ($this.scrollTop() > 0)
      } else {
        /* scrolling down */
        return ($this.scrollTop() + $this.innerHeight() < $this[0].scrollHeight)
      }
    }
    return true
  })
})
