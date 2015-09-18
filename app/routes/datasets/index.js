import Ember from 'ember';

export default Ember.Route.extend({

  queryParams: {
    page: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    },
    keyword: {
      refreshModel: true
    }
  },

  actions: {
    gotoDataset (dataset) {
      this.controllerFor('datasets').transitionToRoute('dataset', dataset);
    }
  },

  model: function (params) {
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
  setupController: function(controller, model, queryParams) {
    this._super(controller, model); // Do not forget this call

    let ctrl = this.controllerFor('datasets');

    // TODO: this should be refactored
    var urlTags = queryParams.keyword || queryParams.queryParams.keyword || '';
    urlTags = urlTags.split(',').map(function (item) { return item.trim(); });
    var tags = model.meta.stats.top_tags
      .map(function (item) {
        item.checked = false;
        return item;
      });

    urlTags.forEach(function (item) {
      if (item) {
        tags.unshift({
          name: item,
          checked: true
        });
      }
    });

    ctrl.setProperties({
      page: +controller.get('page'),
      q: controller.get('q'),
      totalCount: model.meta.stats.total_count,
      count: model.meta.stats.count,
      tags: tags
    });
  }

});
