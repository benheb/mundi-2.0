import Ember from 'ember';

export default Ember.Controller.extend({
  showAddData: false, 

  datasetIds: [],
  legendLayers: [],

  actions: {
    toggleAddData() {
      this.set('showAddData', !this.get('showAddData'))
    },
    addMundiData(id) {
      this.get('datasetIds').pushObject(id);
    },
    toggleSidebar () {
      this.set('showSidebar', !this.get('showSidebar'));
    },
    addLegendLayer(layer) {
      this.get('legendLayers').pushObject(layer);
    },
    updateLegendLayer(layer) {
      this.get('legendLayers').pushObject(layer);
    }
  }

});
