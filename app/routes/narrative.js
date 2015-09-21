import Ember from 'ember';

var json = {
  'service_reqs': false,
  'vision_zero': false
}

export default Ember.Route.extend({

  model: function (params) {
    return this.store.findRecord('dataset', params.id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    if ( model.get('id') === '14faf3d4bfbe4ca4a713bf203a985151_0' ) {
      json.service_reqs = true;
      json.vision_zero = false;
    } else if ( model.get('id') === '3f28bc3ad77f49079efee0ac05d8464c_0' ) {
      json.vision_zero = true;
      json.service_reqs = false;
    }

    controller.set('page', json);
  }
  
});
