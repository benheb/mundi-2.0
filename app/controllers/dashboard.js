import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    gotoNarrative (itemId) {
      this.transitionToRoute('narrative', itemId);
    }
  }

});
