import { moduleForModel, test } from 'ember-qunit';

moduleForModel('my-data', 'Unit | Serializer | my data', {
  // Specify the other units that are required for this test.
  needs: ['serializer:my-data']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
