import QUnit from 'steal-qunit'
import { ViewModel } from './edit-item'

// ViewModel unit tests
QUnit.module('tx/pages/admin-shop/edit-item')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the edit-item component')
})
