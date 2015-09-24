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
    console.log('legendLayers', legendLayers);
    
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

  }.observes('legendLayers.[]')

});
