import Ember from 'ember';
import Map from 'esri/map';
import FeatureLayer from 'esri/layers/FeatureLayer';
import SimpleRenderer from 'esri/renderers/SimpleRenderer';
import ClassBreaksRenderer from 'esri/renderers/ClassBreaksRenderer';
import PopupTemplate from 'esri/dijit/PopupTemplate';
import Extent from 'esri/geometry/Extent';
import SpatialReference from 'esri/SpatialReference';
import jsonUtils from 'esri/renderers/jsonUtils';
import graphicsUtils from 'esri/graphicsUtils';
import geometryEngine from 'esri/geometry/geometryEngine';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Graphic from 'esri/graphic';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import Color from 'esri/Color';

export default Ember.Component.extend({

  classNames: ['esri-map-component'],

  didInsertElement() {
    
    let top = Ember.$('#mundi-map').offset().top;
    let win = Ember.$(window).height();
    //let height = win - ( top + 50 );
    let height = win - ( top ); //no footer 

    Ember.$('#mundi-map').css({height: height+'px'});

    this.map = new Map("mundi-map", {
      center: [-80, 34.5],
      zoom: 3,
      basemap: "gray",
      smartNavigation: false
    });
    
    this._addDataset();

  },

  willRemoveElement() {
    let map = this.get('map');
    if (map) {
      map.destroy();
    }
  },

  _addDataset: function (id) {

    let map = this.map; 
    let dataset = this.get('model');
    console.log('dataset', dataset);

    let url = dataset.get('url');
    let opts = this._getDatasetLayerOpts(dataset);
    let datasetLayer = new FeatureLayer(url, opts);
    datasetLayer.id = dataset.get('id');
    
    map.addLayer( datasetLayer );

    this.dataset = dataset; 

    let jsonStyle = this._getRenderer(dataset);
    jsonStyle = jsonStyle.toJson();

    this.sendAction('addLegendLayer', {
      "id": dataset.get('id'),
      "name": dataset.get('name'),
      "renderer": jsonStyle
    });

    let renderer = this._getRenderer(dataset, opts);
    datasetLayer.setRenderer(renderer);

    this._setExtent(dataset);

  },


  _onAddDataset: function(params) {
    let datasetIds = this.get('datasetIds');
    this._addDataset(this.map, datasetIds[datasetIds.length - 1]);
  }.observes('datasetIds.[]'),



  _onBuffer: function() {
    let buffer = this.get('buffer');
    let dataset = this.get('dataset');
    let layer = this.map.getLayer( dataset.get('id') );
    
    if ( this.graphicsLayer ) {
      this.map.removeLayer(this.graphicsLayer);
      this.graphicsLayer = null;
    }

    this.graphicsLayer = new GraphicsLayer({
      id: 'bufferLayer'
    });

    this.map.addLayer(this.graphicsLayer);
    let geometries = graphicsUtils.getGeometries(layer.graphics);
    let bufferedGeometries = geometryEngine.geodesicBuffer(geometries, buffer.distance, buffer.unit, false);

    let renderer = this._createRendererFromJson({
      'type': 'simple',
      'symbol': {
        'color': [255,240,176,100],
        'outline': {
          'color': [28,28,28,120],
          'width': 0.6,
          'type': 'esriSLS',
          'style': 'esriSLSDashed'
        },
        'type': 'esriSFS',
        'style': 'esriSFSSolid'
      }
    });
    this.graphicsLayer.setRenderer(renderer);

    bufferedGeometries.forEach(function(geometry){
      this.graphicsLayer.add(new Graphic(geometry));
    }.bind(this));

    this.map.reorderLayer(layer, 1);
    window.map = this.map;


  }.observes('buffer'),


  _onChangeTheme: function() {
    let settings = this._getTheme(this.get('quickTheme'));
    let mode = this.get('drawMode') || 'single';

    //set basemap 
    this.map.setBasemap(settings.basemap);
    
    //style layer 
    let dataset = this.get('dataset');
    let layer = this.map.getLayer( dataset.get('id') );
    
    let rend = this._createRendererFromJson( settings.point[ mode ] );
    layer.setRenderer(rend);
    layer.redraw();
    
    console.log('UPDATE LEGEND: ', settings.point[ mode ]);

    this.sendAction('updateLegendLayer', {
      "id": dataset.get('id'),
      "name": dataset.get('name'),
      "renderer": settings.point[ mode ]
    });
    
  }.observes('quickTheme'),



  _onDrawModeChange: function() {
    let mode = this.get('drawMode');
    console.log('mode...', mode);

    let theme = this.get('quickTheme') || 'Minimally Modern';
    let settings = this._getTheme(theme);
    console.log('settings:', settings);

    //set basemap 
    this.map.setBasemap(settings.basemap);
    
    //style layer 
    let dataset = this.get('dataset');
    let layer = this.map.getLayer( dataset.get('id') );
    
    //let rend = this._createRendererFromJson( settings.point[ mode ] );
    let rend = jsonUtils.fromJson(settings.point[ mode ]);
    console.log('rend', rend);
    layer.setRenderer(rend);
    layer.redraw();

    this.sendAction('updateLegendLayer', {
      "id": dataset.get('id'),
      "name": dataset.get('name'),
      "renderer": settings.point[ mode ]
    });

  }.observes('drawMode,selectedAttributeName'),


  onMinChange: function() {
    let def = this._buildExpression();
    let dataset = this.get('dataset');
    let layer = this.map.getLayer( dataset.get('id') );
    layer.setDefinitionExpression(def);
  }.observes('filterMin,filterMax'),


  _setExtent: function(dataset) {
    let extent, ext = dataset.get('extent');
    if (ext && ext.coordinates) {
      let coords = ext.coordinates;
      extent = new Extent(coords[0][0], coords[0][1], coords[1][0], coords[1][1], new SpatialReference({ wkid: 4326 }));
    }

    if (extent) {
      this.map.setExtent(extent.expand(1));
    }
  },


  _getTheme: function(theme) {
    let values = this._classify();
    console.log('classes', values);

    let themes = {
      'Default Theme': {
        'basemap': 'gray',
        'point': {
          'single': {
            'type': 'simple',
            'label': '',
            'description': '',
            'symbol': {
              'color': [229,159,115,225],
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
          'graduated': {
            "type": "classBreaks",
            "label": "",
            "description": "",
            "field": this.get('selectedAttributeName'),
            "minValue": 1,
            "classBreakInfos": [
              {
                "symbol": {
                  'color': [229,159,115,225],
                  "size": 3.5,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [220,220,220,255],
                    'width': 0.6,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": values[0],
                "classMaxValue": values[0]
              },
              {
                "symbol": {
                  'color': [229,159,115,225],
                  "size": 10,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [220,220,220,255],
                    'width': 0.6,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[0]+" to "+values[1],
                "classMaxValue": values[1]
              },
              {
                "symbol": {
                  'color': [229,159,115,225],
                  "size": 25,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [220,220,220,255],
                    'width': 0.6,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[1]+" to "+values[2],
                "classMaxValue": values[2]
              },
              {
                "symbol": {
                  'color': [229,159,115,225],
                  "size": 35,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [220,220,220,255],
                    'width': 0.6,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[2]+" to "+values[3],
                "classMaxValue": values[3]
              },
              {
                "symbol": {
                  'color': [229,159,115,225],
                  "size": 45,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [220,220,220,255],
                    'width': 0.6,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[3]+" to "+values[4],
                "classMaxValue": values[4]
              }
            ],
            "defaultSymbol": {
              'color': [229,159,115,225],
              "size": 6,
              "angle": 0,
              "xoffset": 0,
              "yoffset": 0,
              "type": "esriSMS",
              "style": "esriSMSCircle",
              "outline": {
                'color': [220,220,220,255],
                'width': 0.6,
                "type": "esriSLS",
                "style": "esriSLSSolid"
              }
            }
          }
        },
        'polygon': {

        }
      },
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
                'color': [227,89,86,100],
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
            "field": this.get('selectedAttributeName'),
            "minValue": 1,
            "classBreakInfos": [
              {
                "symbol": {
                  'color': [255,255,255,10],
                  "size": 3.5,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [227,89,86,100],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": values[0],
                "classMaxValue": values[0]
              },
              {
                "symbol": {
                  'color': [255,255,255,10],
                  "size": 10,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [227,89,86,100],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[0]+" to "+values[1],
                "classMaxValue": values[1]
              },
              {
                "symbol": {
                  'color': [255,255,255,10],
                  "size": 25,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [227,89,86,100],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[1]+" to "+values[2],
                "classMaxValue": values[2]
              },
              {
                "symbol": {
                  'color': [255,255,255,10],
                  "size": 35,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [227,89,86,100],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[2]+" to "+values[3],
                "classMaxValue": values[3]
              },
              {
                "symbol": {
                  'color': [255,255,255,10],
                  "size": 45,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [227,89,86,100],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[3]+" to "+values[4],
                "classMaxValue": values[4]
              }
            ],
            "defaultSymbol": {
              'color': [255,255,255,10],
              "size": 6,
              "angle": 0,
              "xoffset": 0,
              "yoffset": 0,
              "type": "esriSMS",
              "style": "esriSMSCircle",
              "outline": {
                'color': [227,89,86,100],
                'width': 1,
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
          'single': {
            'type': 'simple',
            'label': '',
            'description': '',
            'symbol': {
              'color': [131,143,230,225],
              'size': 2,
              'angle': 0,
              'xoffset': 0,
              'yoffset': 0,
              'type': 'esriSMS',
              'style': 'esriSMSCircle',
              'outline': {
                'color': [196,211,253,180],
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
            "field": this.get('selectedAttributeName'),
            "minValue": 1,
            "classBreakInfos": [
              {
                "symbol": {
                  'color': [131,143,230,225],
                  "size": 3.5,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [196,211,253,180],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": values[0],
                "classMaxValue": values[0]
              },
              {
                "symbol": {
                  'color': [131,143,230,225],
                  "size": 10,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [196,211,253,180],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[0]+" to "+values[1],
                "classMaxValue": values[1]
              },
              {
                "symbol": {
                  'color': [131,143,230,225],
                  "size": 25,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [196,211,253,180],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[1]+" to "+values[2],
                "classMaxValue": values[2]
              },
              {
                "symbol": {
                  'color': [131,143,230,225],
                  "size": 35,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [196,211,253,180],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[2]+" to "+values[3],
                "classMaxValue": values[3]
              },
              {
                "symbol": {
                  'color': [131,143,230,225],
                  "size": 45,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [196,211,253,180],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[3]+" to "+values[4],
                "classMaxValue": values[4]
              }
            ],
            "defaultSymbol": {
              'color': [131,143,230,225],
              "size": 6,
              "angle": 0,
              "xoffset": 0,
              "yoffset": 0,
              "type": "esriSMS",
              "style": "esriSMSCircle",
              "outline": {
                'color': [196,211,253,180],
                'width': 1,
                "type": "esriSLS",
                "style": "esriSLSSolid"
              }
            }
          }
        },
        'polygon': {
        }
      },
      'Minimally Modern': {
        'basemap': 'gray',
        'point': {
          'single': {
            'type': 'simple',
            'label': '',
            'description': '',
            'symbol': {
              'color': [255,255,255,0],
              'size': 15,
              'angle': 0,
              'xoffset': 0,
              'yoffset': 0,
              'type': 'esriSMS',
              'style': 'esriSMSCircle',
              'outline': {
                'color': [140,196,56,255],
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
            "field": this.get('selectedAttributeName'),
            "minValue": 1,
            "classBreakInfos": [
              {
                "symbol": {
                  'color': [255,255,255,0],
                  "size": 3.5,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [140,196,56,255],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": values[0],
                "classMaxValue": values[0]
              },
              {
                "symbol": {
                  'color': [255,255,255,0],
                  "size": 10,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [140,196,56,255],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[0]+" to "+values[1],
                "classMaxValue": values[1]
              },
              {
                "symbol": {
                  'color': [255,255,255,0],
                  "size": 25,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [140,196,56,255],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[1]+" to "+values[2],
                "classMaxValue": values[2]
              },
              {
                "symbol": {
                  'color': [255,255,255,0],
                  "size": 35,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [140,196,56,255],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[2]+" to "+values[3],
                "classMaxValue": values[3]
              },
              {
                "symbol": {
                  'color': [255,255,255,0],
                  "size": 45,
                  "angle": 0,
                  "xoffset": 0,
                  "yoffset": 0,
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "outline": {
                    'color': [140,196,56,255],
                    'width': 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  }
                },
                "label": "> "+values[3]+" to "+values[4],
                "classMaxValue": values[4]
              }
            ],
            "defaultSymbol": {
              'color': [255,255,255,0],
              "size": 6,
              "angle": 0,
              "xoffset": 0,
              "yoffset": 0,
              "type": "esriSMS",
              "style": "esriSMSCircle",
              "outline": {
                'color': [140,196,56,255],
                'width': 1,
                "type": "esriSLS",
                "style": "esriSLSSolid"
              }
            }
          }
        },
        'polygon': {}
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
      popupTemplate: this._getDatasetInfoTemplate(dataset)
    };

    return opts;
  },


  _buildExpression: function() {
    let def = null;

    let selected = this.get('selectedAttributeName');
    let min = this.get('filterMin');
    let max = this.get('filterMax');
    
    if ( min && !max ) { 
      def = selected + ' > ' + ( min - 1 );
    } else if ( !min && max ) {
      def = selected + ' < ' + ( max + 1 );
    } else if ( min && max ) {
      def = selected + ' > ' + ( min - 1 ) + ' AND ' + selected + ' < ' + ( max + 1 );
    }

    console.log('def', def);

    return def;
  },

  _createRendererFromJson: function(rendererJson){
    if ( this.get('drawMode') === 'graduated' ) {
      return new ClassBreaksRenderer(rendererJson);
    } else {
      return new SimpleRenderer(rendererJson);
    }
  },


  _classify: function() {
    let fieldName = this.get('selectedAttributeName');
    let fields = this.get('fields');

    console.log('fields', fields);

    let breaks = 4; 
    let values = [];

    fields.forEach(function(f) {
      if ( f.name === fieldName ) {
        console.log('f', f);
        var step = ( f.statistics.max - f.statistics.min ) / breaks;
        for (var i = 0; i<=breaks; i++ ) {
          values.push( f.statistics.min + (step * i) );
        }
      }
    });

    console.log('values', values);
    return values;
  },

  _defaultPointRenderer : {
    'type': 'simple',
    'label': '',
    'description': '',
    'symbol': {
      'color': [229,159,115,225],
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
