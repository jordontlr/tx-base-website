import 'steal-mocha'
import { ViewModel } from './shop-checkout'

// This is faster for browser:
import chai from 'chai/chai'
const assert = chai.assert

describe('tx/pages/page-shop/shop-checkout', function () {
  it('should set the correct message', function () {
    const vm = new ViewModel()
    assert.equal(vm.message, 'This is the shop-checkout component')
  })
})
