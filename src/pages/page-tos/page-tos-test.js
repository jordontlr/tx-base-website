import 'steal-mocha'
import { ViewModel } from './page-tos'

// This is faster for browser:
import chai from 'chai/chai'
const assert = chai.assert

describe('tx/pages/page-tos', function () {
  it('should set the correct message', function () {
    const vm = new ViewModel()
    assert.equal(vm.message, 'This is the page-tos component')
  })
})
