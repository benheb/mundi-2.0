import { moduleForModel, test } from 'ember-qunit';

moduleForModel('my-data', 'Unit | Model | my data', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
