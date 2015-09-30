import Ember from 'ember';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Polyline from 'esri/geometry/Polyline';
import Polygon from 'esri/geometry/Polygon';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import Point from 'esri/geometry/Point';
import Graphic from 'esri/Graphic';
// import webMercatorUtils from 'esri/geometry/support/webMercatorUtils';
//import SimpleRenderer from 'esri/renderers/SimpleRenderer';

export default Ember.Service.extend(Ember.Evented, {

  start(map, view, geomType) {
    
    this.map = map;
    this.view = view;
    this.geomType = geomType;
    this.drawingLayer = new GraphicsLayer({ wkid: this.map.spatialReference.wkid });
    this.map.add(this.drawingLayer);

    this.geom = this.initGeom();

    this.lineSymbol = new SimpleLineSymbol({
      color: [226, 119, 40],
      width: 4
    });

    this.clickHandler = this.view.on('click', this.onClick.bind(this));
    //this.mouseOverHandler = this.view.on('mouseover', this.onMouseOver.bind(this));
  },

  initGeom: function () {
    let geom = new Point({ wkid: this.map.spatialReference.wkid });
    switch (this.geomType) {
      case 'polygon':
        geom = new Polyline({ wkid: this.map.spatialReference.wkid });
        geom.addPath([]);
    }
    return geom;
  },

  stop() {
    this.clickHandler.remove();
    this.map = null;
    this.view = null;
    this.reset();
  },

  reset() {
    this.geom = this.initGeom();
    this.clear();
  },

  clear() {
    this.drawingLayer.clear();
  },

  onMouseOver(evt) {
    console.debug('>>>>> onMouseOver');
  },

  onClick(evt) {

    if (this.geomType === 'point' || evt.srcEvent.ctrlKey) {
      this.finishDrawing(evt);
      return;
    }

    /* TODO:
        use gestures (implement rubberband?, finish drawing on dblclick?)
        devtopia build for latest-latest
    */

    if (this.polylineGraphic) {
      this.drawingLayer.remove(this.polylineGraphic);
    }

    if (this.geom.paths[0].length === 0) {
      this.geom = new Polyline({ wkid: this.map.spatialReference.wkid });
      this.geom.addPath([]);
    }

    this.geom.insertPoint(0, this.geom.paths[0].length, evt.mapPoint);
    
    this.polylineGraphic = new Graphic({
      geometry: this.geom,
      symbol: this.lineSymbol
    });
    
    this.drawingLayer.add(this.polylineGraphic);
  },

  finishDrawing(evt) {
    let geom;
    if (this.geomType === 'polygon') {
      // create the polygon
      geom = new Polygon(this.geom.paths[0]);
    } else {
      geom = evt.mapPoint;
    }
    
    // raise an event
    this.trigger('geometry', geom);

    // prepare to draw another shape
    this.reset();
  }

});
