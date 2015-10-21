import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    buffer (params) {
      this.sendAction('action', params);
    }
  }
});
