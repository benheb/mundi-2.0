import Ember from 'ember';

export default Ember.Component.extend({

  q: '',

  actions: {
    search () {
      this.sendAction('action', this.get('q'));
    }
  }

});
