import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('od-range-slider', 'Integration | Component | od range slider', {
  integration: false
});

test('it renders', function(assert) {
  assert.expect(3);

  var component = this.subject({ filterMin: 10, filterMax: 100, selectedAttribute: '' });
  this.render();

  Ember.run(function () {
    component.set('filterMin', 1);  
  });
  
  assert.equal(component.get('filterMin'), 1);
  assert.equal(this.$('#slider-min-value').text(), 1);
  assert.equal(this.$('#slider-max-value').text(), 100);

});