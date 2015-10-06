import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('od-range-slider', 'Integration | Component | od range slider', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(3);

  let model = Ember.Object.create({
    fields: [{'field1': 'field1', 'field2': 'field2'}]
  });
  this.set('model', model);
  
  this.set('filterMin', 10);  
  this.set('filterMax', 100);
  this.set('selectedAttribute', '');

  this.render(hbs`{{od-range-slider model=model selectedAttribute=selectedAttribute filterMin=filterMin filterMax=filterMax}}`);

  assert.equal(this.$('#slider-min-value').text(), 10);
  assert.equal(this.$('#slider-max-value').text(), 100);

  this.set('filterMin', 1);
  assert.equal(this.$('#slider-min-value').text(), 1);

});