import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'opendata-tng/config/environment';

export default Ember.Component.extend({

  baseUrl: Ember.computed('model.id', function () {
    let model = this.get('model');
    let url = ENV.APP.API;
    url += DS.JSONAPIAdapter.prototype.buildURL('dataset', model.get('id'));
    return url;
  }),

  actions: {
    downloadItem(item) {
      debugger;
    }
  }

});
