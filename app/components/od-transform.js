import Ember from 'ember';

export default Ember.Component.extend({

  bufferDistance: 5,
  bufferUnit: 'miles',

  didInsertElement: function() {
    Ember.$('.dropdown-menu').on('click', function(e) { 
      if ( e.target.id !== 'bufferBtn' ) {
        e.stopPropagation();
      }
    });
  },

  actions: {
    buffer (distance, unit) {
      let params = {'distance': distance, 'unit': unit};
      this.sendAction('action', params);
    },
    changeBufferDistance (distance) {
      this.set('bufferDistance', distance);
    },
    changeBufferUnit (unit) {
      this.set('bufferUnit', unit);
    }
  }
});
