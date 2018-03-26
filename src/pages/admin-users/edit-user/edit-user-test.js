import 'steal-mocha'
import { ViewModel } from './edit-user'

// This is faster for browser:
import chai from 'chai/chai'
const assert = chai.assert

describe('tx/pages/admin-users/edit-user', function () {
  it('should set the correct message', function () {
    const vm = new ViewModel()
    assert.equal(vm.message, 'This is the edit-user component')
  })
})
