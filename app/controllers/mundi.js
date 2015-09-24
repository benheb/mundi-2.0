import Ember from 'ember';

export default Ember.Controller.extend({
  showAddData: false, 

  datasetIds: [],
  legendLayers: [],
  test: [],

  actions: {
    toggleAddData() {
      this.set('showAddData', !this.get('showAddData'))
    },
    addMundiData(id) {
      this.get('datasetIds').addObject(id);
    },
    toggleSidebar () {
      this.set('showSidebar', !this.get('showSidebar'));
    },
    addLegendLayer(layer) {
      this.get('legendLayers').addObject(layer);
    },
    updateLegendLayer(layer) {
      
      var l = this.get('legendLayers');
      var t = [];
      l.forEach(function(obj, i) {
        if ( obj.id === layer.id ) {
          obj = layer;
        }
        t.addObject(obj);
      }.bind(this));

      this.set('legendLayers', []);
      this.set('legendLayers', t);
    }
  }

});
