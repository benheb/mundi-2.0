import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('od-quick-styles', 'Integration | Component | od quick styles', {
  integration: false
});

test('it renders', function(assert) {
  assert.expect(4);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  var component = this.subject({ quickTheme: null });
  this.render();

  this.render(hbs`{{od-quick-styles}}`);

  assert.equal(this.$($('.quick-theme-name')[0]).text().trim(), 'NYT');
  assert.equal(this.$($('.quick-theme-name')[1]).text().trim(), 'Night Commander');

  //no theme set
  assert.equal(this.$('#dropdownMenu1').text().trim(), 'Select Quick Style');

  //set theme, check ui 
  Ember.run(function () {
    component.set('quickTheme', 'NYT');  
  });
  assert.equal(this.$('#dropdownMenu1').text().trim(), 'NYT');

});
