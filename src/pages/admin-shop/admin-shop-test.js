import 'steal-mocha'
import { ViewModel } from './admin-shop'

// This is faster for browser:
import chai from 'chai/chai'
const assert = chai.assert

describe('tx/pages/admin-shop', function () {
  it('should set the correct message', function () {
    const vm = new ViewModel()
    assert.equal(vm.message, 'This is the admin-shop component')
  })
})
