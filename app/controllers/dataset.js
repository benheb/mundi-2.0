import Ember from 'ember';
import ENV from 'opendata-tng/config/environment';

export default Ember.Controller.extend({

  agoMapUrl: Ember.computed('model.itemType', 'model.url', function () {
    let itemType = this.get('model.itemType');
    
    if (itemType === 'Feature Layer' || itemType === 'Image Service') {
      let agoMapUrl = ENV.APP.agoUrl + '/home/webmap/viewer.html';
      agoMapUrl += '?url=' + encodeURIComponent(this.get('model.url'));

      if (itemType === 'Feature Layer') {
        agoMapUrl += '&panel=gallery';
        agoMapUrl += '&suggestField=true';
      }

      return agoMapUrl;
    }
  }),

  actions: {
    toggleSidebar: function () {
      this.set('showSidebar', !this.get('showSidebar'));
    }
  }

});
