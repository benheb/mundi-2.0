import Ember from 'ember';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Polyline from 'esri/geometry/Polyline';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import Point from 'esri/geometry/Point';
import Graphic from 'esri/Graphic';
import webMercatorUtils from 'esri/geometry/support/webMercatorUtils';
//import SimpleRenderer from 'esri/renderers/SimpleRenderer';

export default Ember.Service.extend({

  // init() {
  //   console.debug('>>>>> map-annotation service init');
  //   this.drawingLayer = new GraphicsLayer();
  // },

  start(map, view) {
    console.debug('>>>>> map-annotation service start');
debugger;
    this.map = map;
    this.view = view;
    this.drawingLayer = new GraphicsLayer({ wkid: 102100 });

    this.map.add(this.drawingLayer);

    this.geom = new Polyline({ wkid: this.map.spatialReference.wkid });
    this.geom.addPath([]);
    let lineSymbol = new SimpleLineSymbol({
      color: [226, 119, 40],
      width: 4
    });



    // [-8545705.790652135, 4696867.871862646],
    //   [-8557859.278149463, 4687542.554411868],
    // debugger;
    // this.geom.insertPoint(0, 0, new Point(-100, 40));
    // this.geom.insertPoint(0, 1, new Point(-115, 41));




    this.polylineGraphic = new Graphic({
      geometry: this.geom,
      symbol: lineSymbol
    });

    this.drawingLayer.add(this.polylineGraphic);



    this.clickHandler = this.view.on('click', this.onClick.bind(this));
  },

  stop() {
    this.clickHandler.remove();
    this.map = null;
    this.view = null;
    this.reset();
  },

  reset() {
    this.geom = null;
    this.lastPoint = null;
    this.lastClickTime = 0;
    this.clear();
  },

  clear() {

  },

  onClick(evt) {
    let now = Date.now();

    if (now - this.lastClickTime < 500) {
      console.debug('>>>>> double click! (' + (now-this.lastClickTime) + ')');
      this.onDoubleClick(evt);
      return;
    }

    console.debug('>>>>> click! (' + (now-this.lastClickTime) + ')');

    this.lastClickTime = now;
    

    this.drawingLayer.remove(this.polylineGraphic);
    //debugger;

    if (this.geom.paths[0].length === 0) {
      this.geom = new Polyline({ wkid: this.map.spatialReference.wkid });
      this.geom.addPath([]);
      // this.geom.insertPoint(0, 0, new Point(-100, 40));
      // this.geom.insertPoint(0, 1, new Point(-115, 41));
    }

    // this.geom.insertPoint(0, this.geom.paths[0].length, new Point(evt.mapPoint.longitude, evt.mapPoint.latitude));
    this.geom.insertPoint(0, this.geom.paths[0].length, evt.mapPoint);

    let lineSymbol = new SimpleLineSymbol({
      color: [226, 119, 40],
      width: 4
    });
    
    this.polylineGraphic = new Graphic({
      geometry: this.geom,
      symbol: lineSymbol
    });
    debugger;
    
    this.drawingLayer.add(this.polylineGraphic);
    // this.geom.insertPoint(0, this.geom.paths[0].length, evt.mapPoint);
  },

  onDoubleClick(evt) {
    this.reset();
  }

});
