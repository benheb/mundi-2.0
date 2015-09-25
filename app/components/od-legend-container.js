import Ember from 'ember';

export default Ember.Component.extend({

  layersInLegend: [],

  didInsertElement() {
    this.set('layersInLegend', []);
    this.set('legendLayers', []);
    
    let legend = null; 
    legend = new Legend('legend-container', {
      editable: false,
      layers: []
    });

    this.set('legend', legend);
  },

  _onAddDataset: function(params) {

    let legendLayers = this.get('legendLayers');
    
    legendLayers.forEach(function(layer) {
      this.legend.updateLayer({
        'id': layer.id,
        'name': layer.name,
        'renderer': layer.renderer
      });
    }.bind(this));

  }.observes('legendLayers.[]')

});
