import './pages/test.js'

// VM tests:
import 'steal-mocha'
import AppVM from './app'

// This is faster for browser:
import chai from 'chai/chai'
const assert = chai.assert

describe('app vm', function () {
  it('should set the correct title', function () {
    const appVM = new AppVM()
    assert.equal(appVM.title, 'Tx | Built with Blocks')
  })
})
