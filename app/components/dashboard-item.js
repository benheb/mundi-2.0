import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    gotoNarrative: function (itemId) {
      this.sendAction('action', itemId);
    }
  }

});
