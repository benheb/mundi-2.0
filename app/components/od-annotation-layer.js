import Ember from 'ember';
import ENV from 'opendata-tng/config/environment';

import GraphicsLayer from 'esri/layers/GraphicsLayer';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Graphic from 'esri/Graphic';

export default Ember.Component.extend({

  didInsertElement() {
    this.annotationServiceUrl = ENV.APP.annotationServiceUrl;
  },

  drawingService: Ember.inject.service('drawing-service'),

  activateDrawingTools: Ember.observer('drawingToolsAreActivated', function() {
    // NOTE: need to give some thought to this - should the annotation layer be another component that is a child of the esri-map???


    let drawing = this.get('drawingService');
    drawing.start(this.get('map'), this.get('mapView'), 'point');
    this.annotationLayer = new GraphicsLayer({ wkid: this.get('map').spatialReference.wkid });
    this.get('map').add(this.annotationLayer);
    this.pointSymbol = new SimpleMarkerSymbol({
      color: [200, 0, 0],
      size: 10
    });
    
    drawing.on('geometry', function (geom) {
      let pointGraphic = new Graphic({
        geometry: geom,
        symbol: this.pointSymbol
      });
      this.annotationLayer.add(pointGraphic);
    }.bind(this));




  }),

});
