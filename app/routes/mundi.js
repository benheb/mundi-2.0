import Ember from 'ember';

export default Ember.Route.extend({

  model: function (params) {
    return params.id;
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('datasetIds', Ember.A([model]));
    let ctrl = this.controllerFor('application');
    ctrl.set('isFullScreen', true);
  },

  resetController: function (controller, isExiting, transition) {
    this._super(controller, isExiting, transition); // Do not forget this call
    let ctrl = this.controllerFor('application');
    ctrl.set('isFullScreen', false);
  }

});
