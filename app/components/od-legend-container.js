import Ember from 'ember';

export default Ember.Component.extend({

  layersInLegend: [],

  didInsertElement() {
    let legend = new Legend('legend-container', {
      editable: false,
      layers: []
    });

    legend.on('remove-layer', function(id) {
      this.removeLayerFromMap( id );
    }.bind(this));

    legend.on('reorder-layers', function(obj) {
      thiis._reorderLayers( obj );
    }.bind(this));

    this.legend = legend; 
  },

  _onAddDataset: function(params) {
    
    let legendLayers = this.get('legendLayers');
    console.log('params', legendLayers);
    var layer = legendLayers[legendLayers.length - 1];
    
    legendLayers.forEach(function(layer) {  
      if ( !this.layersInLegend.contains( layer.id )) {
        this.layersInLegend.push(layer.id);
        this.legend.addLayer({
          "id": layer.id,
          "name": layer.name,
          "renderer": layer.renderer
        });
      } else {
        this.legend.updateLayer({
          'id': layer.id,
          'name': layer.name,
          'renderer': layer.renderer
        });
      }
    }.bind(this));

    console.log('legendLayers', legendLayers);

  }.observes('legendLayers.[]')

});
