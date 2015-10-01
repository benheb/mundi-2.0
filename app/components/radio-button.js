import Ember from 'ember';
// {{ radio-button name='dish' value='spam' groupValue=selectedDish }} Spam
// {{ radio-button name='dish' value='eggs' groupValue=selectedDish }} Eggs
//
export default Ember.Component.extend({

  tagName: 'input',

  type: 'radio',

  attributeBindings: [ 'checked', 'name', 'type', 'value' ],

  checked: Ember.computed('value', 'groupValue', function () {
    return this.get('value') === this.get('groupValue');
  }),

  change: function () {
    this.set('groupValue', this.get('value'));
    this.sendAction('action', this.get('groupValue'));
  }
});
