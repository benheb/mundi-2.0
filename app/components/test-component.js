import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'h1',

  greeting: Ember.computed('model.name', function () {
    return 'Hello, ' + this.get('model.name');
  })

});
