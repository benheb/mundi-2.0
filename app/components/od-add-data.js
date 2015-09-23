import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    toggleAddData() {
      $('#search-container').toggle();
    }
  },

  didInsertElement() {
    var search = new OpenSearch('search-container', {});

    search.on('search-result-selected', function(data) {
      var urls = data.split(',');
      var service = urls[0];
      var id = urls[1];

      console.log('id', id);
      
    });

  }

});
