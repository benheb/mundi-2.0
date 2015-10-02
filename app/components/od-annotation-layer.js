import Ember from 'ember';
import ENV from 'opendata-tng/config/environment';
import FeatureLayer from 'esri/layers/FeatureLayer';

import GraphicsLayer from 'esri/layers/GraphicsLayer';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Graphic from 'esri/Graphic';

export default Ember.Component.extend({

  didInsertElement() {
    this.annotationServiceUrl = ENV.APP.annotationServiceUrl;
  },

  mapHasChanged: Ember.observer('map', function () {
    // NOTE: this component shares 'map' with other components on the page through binding
    //    one of the other components is actually responsible for spinning it up
    //    thus, when didInsertElement fires the map doesn't exist yet...
    console.debug('>>>>> mapHasChanged');
    // let map = this.get('map');
    // let opts = {
    //   outFields: ['*'],
    //   visible: true,
    //   token: 'lBwSQUn9v-dmNH8cO56Pir1fIdr94uFC5ywzT6WwkqIpJHdszfHffZhqswJxxlnpyqjWPVhnXi48sfhREEcLdEUtNuH_tzMk4ptY52ze4ghtPaMyFoJHanSFKZoBtLLyWFOA3tfNnEeYDpUlZYL89kn_eDtRfOJ5vI4mCTFdGovP9ueP3eZ4a54t1z7wxP8i'
    // };
    // this.annotationLayer = new FeatureLayer(this.annotationServiceUrl, opts);
    // this.get('map').add(this.annotationLayer);
  }),

  drawingService: Ember.inject.service('drawing-service'),

  activateDrawingTools: Ember.observer('drawingToolsAreActivated', function() {
    // NOTE: need to give some thought to this...

    let drawing = this.get('drawingService');
    drawing.start(this.get('map'), this.get('mapView'), 'point');
    this.drawingLayer = new GraphicsLayer({ wkid: this.get('map').spatialReference.wkid });
    this.get('map').add(this.drawingLayer);
    this.pointSymbol = new SimpleMarkerSymbol({
      color: [200, 0, 0],
      size: 10
    });
    
    drawing.on('geometry', function (geom) {
      let pointGraphic = new Graphic({
        geometry: geom,
        symbol: this.pointSymbol
      });
      this.drawingLayer.add(pointGraphic);
    }.bind(this));

  }),

  activate: Ember.observer('annotationLayerIsVisible', function () {
    this.annotationLayer.visible = true;
  })

});
