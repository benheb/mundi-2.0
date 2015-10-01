import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('od-dataset-result', 'Integration | Component | od dataset result', {
  integration: true
});

moduleForModel('activity', 'Unit | Model | activity', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{od-dataset-result}}`);

  assert.equal(this.$().text().trim(), '');
});
