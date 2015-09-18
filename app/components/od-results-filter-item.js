import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    change () {
      // don't know why we can't just do this.model.get...
      this.sendAction('action', Ember.get(this.model, 'name'), !Ember.get(this.model, 'checked'));
    }
  }

});
