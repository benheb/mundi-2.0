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

    favoriteItem(datasetId) {
      var isFavorite = false;

      var existing = this.store.filter('activity', function (item) { 
        return item.get('activityType') === 'favorite' && item.get('datasetId') === datasetId;
      });
      
      existing.then(function (items) {
        items.forEach(function (item) {
          isFavorite = true;
          item.deleteRecord();
          item.save();
        }.bind(this));

        if (!isFavorite) {
          var record = this.store.createRecord('activity', { activityType: 'favorite', datasetId: datasetId });
          record.save();
        }
      }.bind(this));
    }

  }
  
});
