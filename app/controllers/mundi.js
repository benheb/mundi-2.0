import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  showAddData: false, 

  datasetIds: [],
  legendLayers: [],
  test: [],
  favorited: [],

  actions: {
    toggleAddData() {
      this.set('showAddData', !this.get('showAddData'))
    },
    addMundiData(id) {
      this.get('datasetIds').addObject(id);
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
    },
    favoriteSelected(id) {
      this.get('datasetIds').addObject(id);
    }
  }

});
