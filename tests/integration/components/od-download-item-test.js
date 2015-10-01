import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('od-download-item', 'Integration | Component | od download item', {
  integration: true
});

moduleForModel('dataset', 'Unit | Model | dataset', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{od-download-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#od-download-item}}
      template block text
    {{/od-download-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
