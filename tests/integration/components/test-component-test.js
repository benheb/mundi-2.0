import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('test-component', 'Integration | Component | test component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.set('model', { name: 'Brendan' });

  this.render(hbs`{{test-component model=model}}`);

  assert.equal(this.$().text().trim(), 'Hello, Brendan');
});
