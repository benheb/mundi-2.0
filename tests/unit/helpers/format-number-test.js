import { formatNumber } from '../../../helpers/format-number';
import { module, test } from 'qunit';

module('Unit | Helper | format number');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = formatNumber(42265);
  assert.equal(result, '42,265');
});
