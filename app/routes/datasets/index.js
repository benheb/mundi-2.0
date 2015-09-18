import Ember from 'ember';

export default Ember.Route.extend({

  queryParams: {
    page: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    }
  },

  actions: {
    gotoDataset: function (dataset) {
      this.controllerFor('datasets').transitionToRoute('dataset', dataset);
    }
  },

  model: function (params) {
    // NOTE: I think this is a bug - queryParams are available on transition but params is an empty object
    let ctrl = this.controllerFor('datasets');
    let queryParams = {
      per_page: ctrl.get('perPage')
    };
    if (params) {
      queryParams = Ember.merge(queryParams, params);
    }
    return this.store.query('dataset', queryParams);
  },

  // Here, we're passing metadata to the controller
  // This method will be executed each time the model is reloaded.
  setupController: function(controller, model) {
    this._super(controller, model); // Do not forget this call

    let ctrl = this.controllerFor('datasets');
    
    ctrl.set('page', +controller.get('page'));
    ctrl.set('q', controller.get('q'));

    ctrl.set('totalCount', model.meta.stats.total_count);
    ctrl.set('count', model.meta.stats.count);

    ctrl.set('stats', model.meta.stats);
  }

});
