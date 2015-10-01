import Ember from 'ember';
import Map from 'esri/Map';
import MapView from 'esri/views/MapView';
//import SceneView from 'esri/views/SceneView';
import FeatureLayer from 'esri/layers/FeatureLayer';
import PopupTemplate from 'esri/PopupTemplate';
import Extent from 'esri/geometry/Extent';
import SimpleRenderer from 'esri/renderers/SimpleRenderer';

export default Ember.Component.extend({

  classNames: ['esri-map-component'],

  didInsertElement() {

    let mapOpts = {
      basemap: 'gray',
      smartNavigation: false
    };

    let map = new Map(mapOpts);
    this.set('map', map);
    this.map = map; 

    let mapViewOpts = {
      container: 'mundi-map',  //reference to the DOM node that will contain the view
      map: map,  //references the map object created in step 3
      height: this.element.clientHeight,
      width: this.element.clientWidth
    };

    let extent, ext = null; //ext = dataset.get('extent');
    if (ext && ext.coordinates) {
      let coords = ext.coordinates;
      extent = new Extent(coords[0][0], coords[0][1], coords[1][0], coords[1][1], { wkid: 4326 });
    }

    if (extent) {
      mapViewOpts.extent = extent;
    } else {
      mapViewOpts.center = [ -56.049, 38.485 ];
      mapViewOpts.zoom = 3;
    }

    let view = new MapView(mapViewOpts);
    this.set('mapView', view);

    this._addDataset(map);
  },

  willRemoveElement() {
    let view = this.get('mapView');
    if (view) {
      view.destroy();
    }

    let map = this.get('map');
    if (map) {
      map.destroy();
    }
  },

  _addDataset: function (map, id) {

    let dataset = this.get('model');
    console.log('dataset', dataset);

    //this.store.findRecord('dataset', id).then(function(dataset) {
      let url = dataset.get('url');
      let opts = this._getDatasetLayerOpts(dataset);
      let datasetLayer = new FeatureLayer(url, opts);
      datasetLayer.id = dataset.get('id');
      
      map.add(datasetLayer);

      this.dataset = dataset; 

      let jsonStyle = this._getRenderer(dataset);
      jsonStyle = jsonStyle.toJSON();

      let options = {};
      options.json = jsonStyle;
      options.name = dataset.get('name');
      options.fields = dataset.get('fields');;
      options.type = this._getType(dataset.get('geometryType'));
      options.layerId = dataset.get('id');

      //this._initMalette(options);

      this.sendAction('addLegendLayer', {
        "id": dataset.get('id'),
        "name": dataset.get('name'),
        "renderer": jsonStyle
      });

      this._setExtent(dataset);

    //}.bind(this));

  },


  _onAddDataset: function(params) {
    let datasetIds = this.get('datasetIds');
    this._addDataset(this.map, datasetIds[datasetIds.length - 1]);
  }.observes('datasetIds.[]'),



  _onChangeTheme: function() {
    let settings = this._getTheme(this.get('quickTheme'));
    console.log('settings:', settings);

    //set basemap 
    this.map.basemap = settings.basemap;
    
    //style layer 
    let dataset = this.get('dataset');
    let layer = this.map.getLayer( dataset.get('id') );
    console.log('layer', layer);

    let rend = this._createRendererFromJson( settings.point.single );
    
    layer.visible = false;
      
    let opts = this._getDatasetLayerOpts(dataset);
    opts.renderer = rend; 

    let datasetLayer = new FeatureLayer(dataset.get('url'), opts);
    datasetLayer.id = dataset.get('id');

    this.map.add(datasetLayer);

    this.sendAction('updateLegendLayer', {
      "id": dataset.get('id'),
      "name": dataset.get('name'),
      "renderer": settings.point.single
    });
    
  }.observes('quickTheme'),



  _onDrawModeChange: function() {
    let mode = this.get('drawMode');
    console.log('mode...', mode);

    let theme = this.get('quickTheme') || 'Minimally Modern';
    let settings = this._getTheme(theme);
    console.log('settings:', settings);

    //set basemap 
    this.map.basemap = settings.basemap;
    
    //style layer 
    let dataset = this.get('dataset');
    let layer = this.map.getLayer( dataset.get('id') );
    console.log('layer', layer);

    let rend = this._createRendererFromJson( settings.point[ mode ] );
    
    layer.visible = false;
      
    let opts = this._getDatasetLayerOpts(dataset);
    opts.renderer = rend; 

    let datasetLayer = new FeatureLayer(dataset.get('url'), opts);
    datasetLayer.id = dataset.get('id');

    this.map.add(datasetLayer);

    this.sendAction('updateLegendLayer', {
      "id": dataset.get('id'),
      "name": dataset.get('name'),
      "renderer": settings.point[ mode ]
    });
  }.observes('drawMode'),



  _setExtent: function(dataset) {
    let extent, ext = dataset.get('extent');
    if (ext && ext.coordinates) {
      let coords = ext.coordinates;
      extent = new Extent(coords[0][0], coords[0][1], coords[1][0], coords[1][1], { wkid: 4326 });
    }

    if (extent) {
      setTimeout(function() {
        this.get('mapView').extent = extent;
      }.bind(this),300);
    }
  },


  _initMalette: function(options) {
    let self = this; 
    let map = this.map;
    let dataset = this.dataset; 

    if ( this.malette ) { 
      this.malette.destroy(); 
    }

    this.malette = new Malette('mundi-map', {
      title: options.name,
      style: options.json,
      formatIn: 'esri-json',
      formatOut: 'esri-json',
      fields: options.fields,
      type: options.type,
      exportStyle: true,
      layerId: options.layerId
    });


    this.malette.on('style-change', function( style ){
      var layer; 
      if ( style.layerId ) {
        layer = map.getLayer( style.layerId );
      } else {
        return;
      }

      let rend = this._createRendererFromJson( style );

      layer.visible = false;
      
      let opts = this._getDatasetLayerOpts(dataset);
      opts.renderer = rend; 

      let datasetLayer = new FeatureLayer(dataset.get('url'), opts);
      datasetLayer.id = dataset.get('id');

      map.add(datasetLayer);

      this.sendAction('updateLegendLayer', {
        "id": dataset.get('id'),
        "name": dataset.get('name'),
        "renderer": style
      });

    }.bind(this));

  },



  _getTheme: function(theme) {
    let themes = {
      'NYT': {
        'basemap': 'gray',
        'point': {
          'single': {
            'type': 'simple',
            'label': '',
            'description': '',
            'symbol': {
              'color': [255,255,255,10],
              'size': 20,
              'angle': 0,
              'xoffset': 0,
              'yoffset': 0,
              'type': 'esriSMS',
              'style': 'esriSMSCircle',
              'outline': {
                'color': [227,89,86,90],
                'width': 1,
                'type': 'esriSLS',
                'style': 'esriSLSSolid'
              }
            }
          }, 
          'graduated': {
            "type": "classBreaks",
            "label": "",
            "description": "",
            "symbol": {
              "color": [
                43,
                140,
                190,
                200
              ],
              "size": 6,
              "angle": 0,
              "xoffset": 0,
              "yoffset": 0,
              "type": "esriSMS",
              "style": "esriSMSCircle",
              "outline": {
                "color": [
                  255,
                  255,
                  255,
                  255
                ],
                "width": 1.3,
                "type": "esriSLS",
                "style": "esriSLSSolid"
              }
            },
            "field": "POPULATION_ENROLLED_2008",
            "minValue": 1,
            "classBreakInfos": [
              {
                "symbol": {
                  "color": {
                    "r": 43,
                    "g": 140,
                    "b": 190,
                    "a": 0.7843137254901961
                  },
                  "size": 5.333333333333333,
                  "type": "simplemarkersymbol",
                  "style": "circle",
                  "outline": {
                    "color": {
                      "r": 255,
                      "g": 255,
                      "b": 255,
                      "a": 1
                    },
                    "width": 1.7333333333333334,
                    "type": "simplelinesymbol",
                    "style": "solid",
                    "_inherited": {
                      "p": 2
                    }
                  },
                  "xoffset": 0,
                  "yoffset": 0,
                  "_inherited": {
                    "p": 2
                  }
                },
                "label": 155,
                "classMaxValue": 155,
                "minValue": 1,
                "maxValue": 155
              },
              {
                "symbol": {
                  "color": {
                    "r": 43,
                    "g": 140,
                    "b": 190,
                    "a": 0.7843137254901961
                  },
                  "size": 13.333333333333332,
                  "type": "simplemarkersymbol",
                  "style": "circle",
                  "outline": {
                    "color": {
                      "r": 255,
                      "g": 255,
                      "b": 255,
                      "a": 1
                    },
                    "width": 1.7333333333333334,
                    "type": "simplelinesymbol",
                    "style": "solid",
                    "_inherited": {
                      "p": 2
                    }
                  },
                  "xoffset": 0,
                  "yoffset": 0,
                  "_inherited": {
                    "p": 2
                  }
                },
                "label": "> 155 to 330.25",
                "classMaxValue": 330.25,
                "minValue": 155,
                "maxValue": 330.25
              },
              {
                "symbol": {
                  "color": {
                    "r": 43,
                    "g": 140,
                    "b": 190,
                    "a": 0.7843137254901961
                  },
                  "size": 21.333333333333332,
                  "type": "simplemarkersymbol",
                  "style": "circle",
                  "outline": {
                    "color": {
                      "r": 255,
                      "g": 255,
                      "b": 255,
                      "a": 1
                    },
                    "width": 1.7333333333333334,
                    "type": "simplelinesymbol",
                    "style": "solid",
                    "_inherited": {
                      "p": 2
                    }
                  },
                  "xoffset": 0,
                  "yoffset": 0,
                  "_inherited": {
                    "p": 2
                  }
                },
                "label": "> 330.25 to 505.5",
                "classMaxValue": 505.5,
                "minValue": 330.25,
                "maxValue": 505.5
              },
              {
                "symbol": {
                  "color": {
                    "r": 43,
                    "g": 140,
                    "b": 190,
                    "a": 0.7843137254901961
                  },
                  "size": 29.333333333333332,
                  "type": "simplemarkersymbol",
                  "style": "circle",
                  "outline": {
                    "color": {
                      "r": 255,
                      "g": 255,
                      "b": 255,
                      "a": 1
                    },
                    "width": 1.7333333333333334,
                    "type": "simplelinesymbol",
                    "style": "solid",
                    "_inherited": {
                      "p": 2
                    }
                  },
                  "xoffset": 0,
                  "yoffset": 0,
                  "_inherited": {
                    "p": 2
                  }
                },
                "label": "> 505.5 to 680.75",
                "classMaxValue": 680.75,
                "minValue": 505.5,
                "maxValue": 680.75
              },
              {
                "symbol": {
                  "color": {
                    "r": 43,
                    "g": 140,
                    "b": 190,
                    "a": 0.7843137254901961
                  },
                  "size": 40,
                  "type": "simplemarkersymbol",
                  "style": "circle",
                  "outline": {
                    "color": {
                      "r": 255,
                      "g": 255,
                      "b": 255,
                      "a": 1
                    },
                    "width": 1.7333333333333334,
                    "type": "simplelinesymbol",
                    "style": "solid",
                    "_inherited": {
                      "p": 2
                    }
                  },
                  "xoffset": 0,
                  "yoffset": 0,
                  "_inherited": {
                    "p": 2
                  }
                },
                "label": "> 680.75 to 856",
                "classMaxValue": 856,
                "minValue": 680.75,
                "maxValue": 856
              }
            ],
            "defaultSymbol": {
              "color": [
                43,
                140,
                190,
                200
              ],
              "size": 6,
              "angle": 0,
              "xoffset": 0,
              "yoffset": 0,
              "type": "esriSMS",
              "style": "esriSMSCircle",
              "outline": {
                "color": [
                  255,
                  255,
                  255,
                  255
                ],
                "width": 1.3,
                "type": "esriSLS",
                "style": "esriSLSSolid"
              }
            }
          }
        }, 
        'polygon': {

        }
      },
      'Night Commander': {
        'basemap': 'dark-gray',
        'point': {
          'type': 'simple',
          'label': '',
          'description': '',
          'symbol': {
            'color': [131,143,230,225],
            'size': 6,
            'angle': 0,
            'xoffset': 0,
            'yoffset': 0,
            'type': 'esriSMS',
            'style': 'esriSMSCircle',
            'outline': {
              'color': [196,211,253,180],
              'width': 2,
              'type': 'esriSLS',
              'style': 'esriSLSSolid'
            }
          }
        }, 
        'polygon': {

        }
      },
      'Minimally Modern': {
        'basemap': 'gray',
        'point': {
          'type': 'simple',
          'label': '',
          'description': '',
          'symbol': {
            'color': [255,255,255,0],
            'size': 10,
            'angle': 0,
            'xoffset': 0,
            'yoffset': 0,
            'type': 'esriSMS',
            'style': 'esriSMSCircle',
            'outline': {
              'color': [140,196,56,255],
              'width': 2,
              'type': 'esriSLS',
              'style': 'esriSLSSolid'
            }
          }
        }, 
        'polygon': {

        }
      }
    }

    return themes[theme];
  },


  _getType: function(geomType) {
    var type;
    //"convert" types to send to malette; 
    switch(geomType) {
      case 'esriGeometryPoint': 
        type = 'point';
        break;
      case 'esriGeometryPolygon': 
        type = 'polygon';
        break;
      default: 
        type = 'point';
    }
    return type; 
  },


  _getDatasetInfoTemplate: function (dataset) {
    let displayFieldName = dataset.get('displayField');
    let title = displayFieldName ? '{' + displayFieldName + '}' : 'Attributes';
    return new PopupTemplate({ title: title, description: '{*}' });
  },

  _getRenderer: function(dataset){
    let geometryType = dataset.get('geometryType');
    let renderer;

    //depending on the type, load in the default renderer as json
    switch (geometryType){
    case 'esriGeometryPolygon':
      renderer = this._createRendererFromJson(this._defaultPolygonRenderer);
      break;
    case 'esriGeometryPoint':
      renderer = this._createRendererFromJson(this._defaultPointRenderer);
      break;
    case 'esriGeometryMultipoint':
      renderer = this._createRendererFromJson(this._defaultPointRenderer);
      break;
    case 'esriGeometryPolyline':
      renderer = this._createRendererFromJson(this._defaultLineRenderer);
      break;
    case 'esriGeometryLine':
      renderer = this._createRendererFromJson(this._defaultLineRenderer);
      break;
    default: 
      renderer = this._createRendererFromJson(this._defaultPolygonRenderer);
    }
    return renderer;
  },

  _getDatasetLayerOpts: function (dataset) {
    let opts = {
      minScale: 0,
      maxScale: 0,
      outFields: ['*'],
      popupTemplate: this._getDatasetInfoTemplate(dataset),
      renderer: this._getRenderer(dataset, opts)
    };
    
    return opts;
  },

  _createRendererFromJson: function(rendererJson){
    return new SimpleRenderer(rendererJson);
  },

  _defaultPointRenderer : {
    'type': 'simple',
    'label': '',
    'description': '',
    'symbol': {
      'color': [49,130,189,225],
      'size': 6,
      'angle': 0,
      'xoffset': 0,
      'yoffset': 0,
      'type': 'esriSMS',
      'style': 'esriSMSCircle',
      'outline': {
        'color': [220,220,220,255],
        'width': 0.6,
        'type': 'esriSLS',
        'style': 'esriSLSSolid'
      }
    }
  },

  _defaultLineRenderer :  {
    'type': 'simple',
    'symbol': {
      'color': [0,122,194,255],
      'width': 2,
      'type': 'esriSLS',
      'style': 'esriSLSSolid'
    }
  },

  _defaultPolygonRenderer :{
    'type': 'simple',
    'symbol': {
      'color': [49,130,189,225],
      'outline': {
        'color': [220,220,220,255],
        'width': 0.6,
        'type': 'esriSLS',
        'style': 'esriSLSSolid'
      },
      'type': 'esriSFS',
      'style': 'esriSFSSolid'
    }
  }

});
