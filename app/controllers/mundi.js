import Ember from 'ember';

export default Ember.Controller.extend({
  showAddData: false, 

  datasetIds: [],

  actions: {
    toggleAddData() {
      this.set('showAddData', !this.get('showAddData'))
    },
    addMundiData(id) {
      this.get('datasetIds').pushObject(id);
    }
  }

});
