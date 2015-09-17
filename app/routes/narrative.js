import Ember from 'ember';

var json = {
  dataset: null,
  '14faf3d4bfbe4ca4a713bf203a985151_0': {
    name: 'All Service Requests!'
  }
}


export default Ember.Route.extend({

  model: function (params) {

    json.dataset = this.store.findRecord('dataset', params.id);
    return json;
  }

});
