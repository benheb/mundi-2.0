import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    closeSidebar() {
      this.set('showSidebar', false);
    }
  }

});
