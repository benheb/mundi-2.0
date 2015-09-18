import Ember from 'ember';

export default Ember.Component.extend({

  showRequestButton: true,

  showForm: false,

  showConfirmation: false,

  disableButton: false,

  _setShowForm (val) {
    this.set('showRequestButton', !val);
    this.set('showForm', val);
    this.set('showConfirmation', !val);
  },

  _setShowConfirmation (val) {
    this.set('showRequestButton', !val);
    this.set('showForm', !val);
    this.set('showConfirmation', val);
  },

  actions: {
    setShowForm (val) {
      this._setShowForm(val);
    },
    submitForm () {
      // submit form data via xhr...
      // but we don't have an api so simulate it
      this.set('disableButton', true);

      Ember.run.later(this, '_setShowConfirmation', true, 1200);
    }
  }

});
