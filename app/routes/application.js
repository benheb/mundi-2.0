import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    downloadItem(model, url) {
      console.debug('>>>>> [application route] downloading ' + model.get('name') + ' from ' + url);
      return true;
    }
  }
  
});
