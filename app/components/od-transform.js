import Ember from 'ember';

export default Ember.Component.extend({

  bufferDistance: 20,
  bufferUnit: 'miles',
  countyAggregate: false,
  stateAggregate: false,

  didInsertElement: function() {
    Ember.$('.dropdown-menu').on('click', function(e) { 
      if ( e.target.id !== 'bufferBtn' ) {
        e.stopPropagation();
      }
    });

    this.set('aggregate', false);
  },

  watchCountyAggregate: function() {
    let aggregate = this.get('countyAggregate');
    this.sendAction('aggregateCounty', aggregate);
  }.observes('countyAggregate'),

  watchStateAggregate: function() {
    let aggregate = this.get('stateAggregate');
    this.sendAction('aggregateState', aggregate);
  }.observes('stateAggregate'),

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
