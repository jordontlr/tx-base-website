import $ from 'jquery'
import callback from 'can-view-callbacks'
import 'cropit'

callback.attr('cropit-modal', (el) => {
  let $el = $(el)

  $el.on('shown.bs.modal', function () {
    let $cropit = $el.find('#image-cropper')

    $cropit.cropit({
      exportZoom: 2,
      maxZoom: 3,
      imageBackground: true,
      imageBackgroundBorderWidth: 5
    })

    $('.select-image-btn').click(function () {
      $el.find('.cropit-image-input').click()
    })

    $('.rotate-cw-btn').click(function () {
      $cropit.cropit('rotateCW')
    })

    $('.rotate-ccw-btn').click(function () {
      $cropit.cropit('rotateCCW')
    })

    $cropit.on('get-data', function() {
      let data = $cropit.cropit('export', {
        type: 'image/jpeg',
        quality: .9
      })

      $cropit.attr('data-image-data', data)
    })
  })
})
