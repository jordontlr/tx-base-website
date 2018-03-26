import 'steal-mocha'
import { ViewModel } from './page-shop'

// This is faster for browser:
import chai from 'chai/chai'
const assert = chai.assert

describe('tx/pages/page-shop', function () {
  it('should set the correct message', function () {
    const vm = new ViewModel()
    assert.equal(vm.message, 'This is the page-shop component')
  })
})
