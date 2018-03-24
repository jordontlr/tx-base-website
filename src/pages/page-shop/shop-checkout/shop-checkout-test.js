import QUnit from 'steal-qunit'
import { ViewModel } from './shop-checkout'

// ViewModel unit tests
QUnit.module('~/pages/page-shop/shop-checkout')

QUnit.test('Has message', function () {
  var vm = new ViewModel()
  QUnit.equal(vm.message, 'This is the shop-checkout component')
})
