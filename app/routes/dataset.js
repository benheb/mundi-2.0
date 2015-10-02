import Ember from 'ember';

export default Ember.Route.extend({

  model: function (params) {
    return this.store.findRecord('dataset', params.id);
  },

  resetController: function (controller, isExiting, transition) {
    this._super(controller, isExiting, transition); // Do not forget this call
    controller.set('cachedComments', null);
  }
  
});
