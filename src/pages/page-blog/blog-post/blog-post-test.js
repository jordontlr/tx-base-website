import 'steal-mocha'
import { ViewModel } from './blog-post'
// import blogStore from '~/models/fixtures/blog'

// This is faster for browser:
import chai from 'chai/chai'
const assert = chai.assert

describe('tx/pages/page-blog/blog-post', function () {
  it('should set the correct message', function () {
    const vm = new ViewModel()
    assert.equal(vm.message, 'This is the blog-post component')
  })
})
