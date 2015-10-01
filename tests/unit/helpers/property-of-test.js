import { propertyOf } from '../../../helpers/property-of';
import { module, test } from 'qunit';

module('Unit | Helper | property of');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = propertyOf({foo:'foooo'}, 'foo');
  assert.equals(result, 'foooo');
});
