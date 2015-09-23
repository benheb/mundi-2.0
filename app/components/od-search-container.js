import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    var search = new OpenSearch('search-container', {});

    search.on('search-result-selected', function(data) {
      var urls = data.split(',');
      var service = urls[0];
      var id = urls[1];

      this.sendAction('action', id);
      this.set('showAddData', false);
    }.bind(this));
  },

  visibleClass: Ember.computed('showAddData', function() {
    return this.get('showAddData') ? 'visible' : '';
  })

});
