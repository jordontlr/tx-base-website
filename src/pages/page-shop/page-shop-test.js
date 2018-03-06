import QUnit from 'steal-qunit'
import { ViewModel } from './page-shop'

// ViewModel unit tests
QUnit.module('tx/pages/page-shop')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the page-shop component')
})
