import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    quickThemeChanged (style) {
      this.sendAction('action', style);
    }
  }

});
