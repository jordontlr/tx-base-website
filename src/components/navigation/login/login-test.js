import QUnit from 'steal-qunit'
import { ViewModel } from './login'

// ViewModel unit tests
QUnit.module('tx/components/navigation/login')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the login-modal component')
})
