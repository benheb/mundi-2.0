import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('od-activities-sidebar', 'Integration | Component | od activities sidebar', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{od-activities-sidebar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#od-activities-sidebar}}
      template block text
    {{/od-activities-sidebar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
