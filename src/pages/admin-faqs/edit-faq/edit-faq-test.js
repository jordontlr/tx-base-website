import QUnit from 'steal-qunit'
import { ViewModel } from './edit-faq'

// ViewModel unit tests
QUnit.module('tx/pages/admin-faqs/edit-faq')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the edit-faq component')
})
