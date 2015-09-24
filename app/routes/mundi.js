import Ember from 'ember';

export default Ember.Route.extend({

  model: function (params) {
    return params.id;
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('datasetIds', Ember.A([model]));
  }

});
