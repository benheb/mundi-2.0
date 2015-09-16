import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    gotoNarrative: function(itemId) {
      console.log('in controller.. ');
      this.transitionToRoute('narrative', itemId);
    }
  }

});
