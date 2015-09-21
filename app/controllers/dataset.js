import Ember from 'ember';

export default Ember.Controller.extend({

  showSidebar: false,

  actions: {
    toggleSidebar: function () {
      this.set('showSidebar', !this.get('showSidebar'));
    }
  }

});
