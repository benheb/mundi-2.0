import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function (controller) {
    this.store.findAll('activity')
      .then(function (result) {
        controller.set('activities', result);
      }.bind(this));
  },

  actions: {
    
    downloadItem(model, url) {
      console.debug('>>>>> [application route] downloading ' + model.get('name') + ' from ' + url);
      var record = this.store.createRecord('activity', { activityType: 'download', url: url, datasetId: model.get('id') });
      record.save();
    },

    favoriteItem(model) {
      var record = this.store.createRecord('activity', { activityType: 'favorite', datasetId: model.get('id') });
      record.save();
    }

  }
  
});
