import Ember from 'ember';

export default Ember.Component.extend({
  statusChart: new Cedar({
    "type": "bar",
    "specification": {
      "inputs": [
        { "name": "x", "type": [ "string" ], "required": true },
        { "name": "y", "type": [ "numeric" ], "required": true }
      ],
      "query": {},
      "template":{
        "padding": "strict",
        "axes": [
          {
            "type": "x",
            "scale": "x",
            "titleOffset": 45,
            "title": "{x.label}",          
            "properties": {
              "title": {
                "fontSize": {"value": 15},
                "fill": {"value": "#999"},
                "fontWeight": {"value": "normal"}
              },          
              "axis": {
                 "stroke": {"value": "#dbdad9"},
                 "strokeWidth": {"value": 1.5}
              },
              "ticks": {
                 "stroke": {"value": "#dbdad9"}
              },
              "labels": {
                "fill": {"value": "#999"},
                "angle": {"value": -50},
                "align": {"value": "right"},
                "baseline": {"value": "middle"}
              }
            }
          },
          {
            "type": "y",
            "scale": "y",
            "titleOffset": 45,
            "title": "{y.label}",
            "properties": {
              "title": {
                "fontSize": {"value": 15},
                "fill": {"value": "#999"},
                "fontWeight": {"value": "normal"}
              },          
              "axis": {
                 "stroke": {"value": "#dbdad9"},
                 "strokeWidth": {"value": 1.5}
              },
              "ticks": {
                 "stroke": {"value": "#dbdad9"}
              },
              "labels": {
                "fill": {"value": "#999"}
              }
            }
          }      
        ],
        "data": [
          {
            "name": "table",
            "format": {"property": "features"}
          }
        ],    
        "marks": [
          {
            "from": {"data": "table"},
            "properties": {
              "enter": {
              },
              "update": {
                "width": {"band": true, "offset": -1, "scale": "x"},
                "x": {"field": "attributes.{x.field}", "scale": "x"},
                "y": {"field": "attributes.{y.field}", "scale": "y"},
                "y2": {"scale": "y", "value": 0 },            
                "fill": {"value": "#0079c1"}
              },
              "hover": {
                "fill": {"value": "#29b6ea"}
              }
            },
            "type": "rect"
          }
        ],    
        "scales": [
          {
            "domain": {
              "data": "table",
              "field": "attributes.{x.field}"
            },
            "name": "x",
            "range": "width",
            "type": "ordinal",
            "padding": 0.25
          },
          {
            "domain": {
              "data": "table",
              "field": "attributes.{y.field}"
            },
            "name": "y",
            "nice": true,
            "range": "height"
          }
        ]
      }
    },
    "dataset": {
      "url":"http://services.arcgis.com/bkrWlSKcjUDFDtgw/ArcGIS/rest/services/All_Service_Requests_Last_30_Days/FeatureServer/0",
      "query": {
        "groupByFieldsForStatistics": "STATUS_COD",
        "outStatistics": [{
          "statisticType": "count", 
          "onStatisticField": "STATUS_COD", 
          "outStatisticFieldName": "STATUS_COD_count"
        }]
      },
      "mappings":{
        "x": {"field":"STATUS_COD","label":"Status of Service Request"},
        "y": {"field":"STATUS_COD_count","label":"Count"}
      }
    }
  }),
  chart: new Cedar({
    "type": "bar-horizontal",
    "specification": {
      "inputs": [
        { "name": "x", "type": [ "numeric", "string" ], "required": true },
        { "name": "y", "type": [ "string" ], "required": true }
      ],
      "query": {
        "orderByFields": "{x.field} DESC",
        "groupByFieldsForStatistics": "{y.field}",
        "outStatistics": [{
            "statisticType": "sum",
            "onStatisticField": "{x.field}",
            "outStatisticFieldName": "{x.field}"
        }]
      },
      "template":{
        "padding": "strict",
        "axes": [
          {
            "type": "x",
            "scale": "x",
            "titleOffset": 45,
            "title": "{x.label}",
            "tickPadding": 10,        
            "properties": {
              "title": {
                "fontSize": {"value": 15},
                "fill": {"value": "#999"},
                "fontWeight": {"value": "normal"}
              },
              "axis": {
                 "stroke": {"value": "#dbdad9"},
                 "strokeWidth": {"value": 1.5}
              },
              "ticks": {
                 "stroke": {"value": "#dbdad9"}
              },
              "labels": {
                "fill": {"value": "#999"},
                "angle": {"value": 0},
                "baseline": {"value": "middle"}
              }
            }
          },
          {
            "type": "y",
            "scale": "y",
            "titleOffset": 25,
            "title": "{y.label}",
            "padding": 0.25,
            "properties": {
              "title": {
                "fontSize": {"value": 15},
                "fill": {"value": "#999"},
                "fontWeight": {"value": "normal"}
              },
              "axis": {
                 "stroke": {"value": "#dbdad9"},
                 "strokeWidth": {"value": 1.5}
              },
              "ticks": {
                 "stroke": {"value": "#dbdad9"}
              },
              "labels": {
                "fill": {"value": "#999"},
                "angle": {"value": 0},
                "baseline": {"value": "middle"}
              }
            }
          }      
        ],
        "data": [
          {
            "name": "table",
            "format": {"property": "features"}
          }
        ],    
        "marks": [
          {
            "from": {"data": "table"},
            "properties": {
              "enter": {
                "height": {"band": true, "offset": -1, "scale": "y"},
                "y": {"scale": "y", "field": "attributes.{y.field}"},
                "x2": {"scale": "x", "field": "attributes.{x.field}"},
                "x": {"scale": "x", "value": 0 }
              },
              "hover": {
                "fill": {"value": "#29b6ea"}
              },
              "update": {
                "fill": {"value": "#0079c1"}
              }
            },
            "type": "rect"
          }
        ],    
        "scales": [
          {
            "domain": {
              "data": "table",
              "field": "attributes.{y.field}"
            },
            "name": "y",
            "range": "height",
            "type": "ordinal",
            "padding": 0.25
          },
          {
            "domain": {
              "data": "table",
              "field": "attributes.{x.field}"
            },
            "name": "x",
            "nice": true,
            "range": "width"
          }
        ]
      }
    },
    "dataset": {
      "url":"http://services.arcgis.com/bkrWlSKcjUDFDtgw/ArcGIS/rest/services/All_Service_Requests_Last_30_Days/FeatureServer/0",
      "query": {
        "groupByFieldsForStatistics": "ORGANIZATI",
        "outStatistics": [{
          "statisticType": "count", 
          "onStatisticField": "ORGANIZATI", 
          "outStatisticFieldName": "ORGANIZATI_count"
        }]
      },
      "mappings":{
        "y": {"field":"ORGANIZATI","label":"Organization"},
        "x": {"field":"ORGANIZATI_count","label":"Number of Requests"}
      }
    }
  }),

  didInsertElement: function(){

    this.chart.override = {
      'marks': [
        { 'properties': {
            'hover': {'fill': { 'value': '#2B4888'}},
            'update': {'fill': { 'value': '#2B4888'}}
          }
        }
      ]
    }

    this.statusChart.override = {
      'marks': [
        { 'properties': {
            'hover': {'fill': { 'value': '#2B4888'}},
            'update': {'fill': { 'value': '#2B4888'}}
          }
        }
      ]
    }

    console.log('show me!');
    this.chart.show({ elementId: '#chart'});
    this.statusChart.show({ elementId: '#chart-status'});
  }
});