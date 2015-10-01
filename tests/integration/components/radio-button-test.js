import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('radio-button', 'Integration | Component | radio button', {
  integration: false
});

test('it renders', function(assert) {
  assert.expect(8);

  var component = this.subject({ name: 'dish', value: 'spam', groupValue: 'spam' });
  this.render();

  assert.equal(this.$().attr('type'), 'radio');
  assert.equal(this.$().attr('name'), 'dish');
  assert.equal(this.$().attr('value'), 'spam');
  assert.ok(this.$().prop('checked'));

  Ember.run(function () {
    component.set('value', 'eggs');  
  });
  
  assert.equal(this.$().attr('type'), 'radio');
  assert.equal(this.$().attr('name'), 'dish');
  assert.equal(this.$().attr('value'), 'eggs');
  assert.ok(!this.$().prop('checked'));

});

test('clicking the radio button updates the groupValue', function(assert) {
  assert.expect(3);

  var component = this.subject({ name: 'dish', value: 'spam', groupValue: 'eggs' });
  this.render();

  //initial groupValue was set by attribute
  assert.equal(component.get('groupValue'), 'eggs');

  this.$().click();
  
  //clicking should update the groupValue and the checked attribute
  assert.equal(component.get('groupValue'), 'spam');
  assert.ok(this.$().prop('checked'));

});
