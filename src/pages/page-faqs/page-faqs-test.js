import 'steal-mocha'
import { ViewModel } from './page-faqs'

// This is faster for browser:
import chai from 'chai/chai'
const assert = chai.assert

describe('tx/pages/page-faqs', function () {
  it('should set the correct message', function () {
    const vm = new ViewModel()
    assert.equal(vm.message, 'This is the page-faqs component')
  })
})
