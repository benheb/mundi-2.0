import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    gotoNarrative: function(itemId) {
      this.transitionToRoute('narrative', itemId);
    }
  }

});
