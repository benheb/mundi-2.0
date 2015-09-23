import Ember from 'ember';

export default Ember.Component.extend({

  classNames: [ 'dropdown' ],

  actions: {
    downloadItem(model, url) {
      console.debug('>>>>> downloading ' + model.get('name') + ' from ' + url);
      // NOTE: we need to return false from the click handler on the anchor tag
      //       so the browser doesn't follow the link
      //       but that means the dropdown doesn't close, so...
      Ember.$(this.element).find('.dropdown-toggle').dropdown('toggle');

      this.sendAction('action', model, url);
    }
  }

});
