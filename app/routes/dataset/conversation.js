import Ember from 'ember';
import ENV from 'opendata-tng/config/environment';

export default Ember.Route.extend({

  featureService: Ember.inject.service('feature-service'),

  model: function (params, transition) {

    /* NOTE: since we are not using the store, we don't get caching for free
          (perhaps we should consider using it...)
          so we need to cache it
          BUT we need to clear the cache when we leave the dataset route (NOT this route)
          see resetController in routes/dataset.js
    */
    let datasetController = this.controllerFor('dataset');
    let cachedModel = datasetController.get('cachedComments');
    if (cachedModel) {
      return cachedModel;
    }

    var annotationLayerUrl = ENV.APP.annotationServiceUrl;

    // TODO: not sure if this is a good way to get this...
    let queryParams = { orderByFields: 'createdAt' };
    let filterParams = { datasetId: transition.params.dataset.id };
    let model = this.get('featureService').fetch(annotationLayerUrl, queryParams, filterParams)
      .then(function (response) {
        return response.features.map(function (feat) {
          return feat.attributes;
        });
      }, function () {
        alert('an error ocurred fetching comments');
      }
    );

    datasetController.set('cachedComments', model)
    
    return model;
  }
  
});
