import $ from 'jquery'
import callback from 'can-view-callbacks'

callback.attr('modal-autofocus', (el) => {
  let $el = $(el)

  $el.on('shown.bs.modal', function () {
    $(this).find('[autofocus]').focus();
  });

})
