import Ember from 'ember';

export default Ember.Component.extend({

  bufferDistance: 20,
  bufferUnit: 'miles',
  aggregate: false,

  didInsertElement: function() {
    Ember.$('.dropdown-menu').on('click', function(e) { 
      if ( e.target.id !== 'bufferBtn' ) {
        e.stopPropagation();
      }
    });

    this.set('aggregate', false);
  },

  watchAggregate: function() {
    let aggregate = this.get('aggregate');
    this.sendAction('aggregate', aggregate);
  }.observes('aggregate'),

  actions: {
    buffer (distance, unit) {
      let params = {'distance': distance, 'unit': unit};
      this.sendAction('buffer', params);
    },
    changeBufferDistance (distance) {
      this.set('bufferDistance', distance);
    },
    changeBufferUnit (unit) {
      this.set('bufferUnit', unit);
    }
  }
});
