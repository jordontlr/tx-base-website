import QUnit from 'steal-qunit'
import { ViewModel } from './profile'

// ViewModel unit tests
QUnit.module('tx/components/navigation/profile')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the profile-modal component')
})
