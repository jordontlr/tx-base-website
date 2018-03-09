import $ from 'jquery'
import callback from 'can-view-callbacks'
import 'cropit'

callback.attr('cropit-modal', (el) => {
  let $el = $(el)
  let init = false

  $el.on('shown.bs.modal', function () {
    let $cropit = $el.find('#image-cropper')

    console.log($cropit.attr('data-init'))

    if (!init) {
      init = true

      $cropit.cropit({
        exportZoom: 2,
        maxZoom: 3,
        imageBackground: true,
        imageBackgroundBorderWidth: 5
      })

      let current = $cropit.attr('data-current-image')
      if (current !== 'undefined' && current !== '') {
        $cropit.cropit('imageSrc', current)
      }

      $('.select-image-btn').click(function () {
        $el.find('.cropit-image-input').click()
      })

      $('.rotate-cw-btn').click(function () {
        $cropit.cropit('rotateCW')
      })

      $('.rotate-ccw-btn').click(function () {
        $cropit.cropit('rotateCCW')
      })

      $cropit.on('get-data', function () {
        let data = $cropit.cropit('export', {
          type: 'image/jpeg',
          quality: 0.9
        })

        $cropit.attr('data-image-data', data)
        $cropit.attr('data-current-image', data)
      })
    }
  })
})
