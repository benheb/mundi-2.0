import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('od-search', 'Integration | Component | od search', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // // Set any properties with this.set('myProperty', 'value');
  // // Handle any actions with this.on('myAction', function(val) { ... });
  
  this.render(hbs`{{od-search}}`);

  assert.equal(this.$().text().trim().indexOf('Find'), 0);

});
