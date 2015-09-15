import Ember from 'ember';

export default Ember.Component.extend({

  q: '',

  actions: {
    search: function () {
      this.sendAction('action', this.get('q'));
    }
  }

});
