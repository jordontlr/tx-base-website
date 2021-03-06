import QUnit from 'steal-qunit'
import { ViewModel } from './forgot-password'

// ViewModel unit tests
QUnit.module('tx/components/navigation/forgot-password')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the forgot-password-modal component')
})
