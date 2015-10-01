import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    changeDrawMode (style) {
      this.sendAction('action', style);
    }
  }

});
