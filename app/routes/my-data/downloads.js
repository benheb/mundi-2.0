import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    return this.store.filter('activity', function (item) { return item.get('activityType') === 'download'; });
  }

});
