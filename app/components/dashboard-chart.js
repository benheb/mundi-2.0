import Ember from 'ember';

var potholeData = {
  features:[
    {
      "attributes": {
        "Month": 'January',
        "Potholes": 107
      }
    },
    {
      "attributes": {
        "Month": 'February',
        "Potholes": 120
      }
    },
    {
      "attributes": {
        "Month": 'March',
        "Potholes": 100
      }
    },
    {
      "attributes": {
        "Month": 'April',
        "Potholes": 190
      }
    },
    {
      "attributes": {
        "Month": 'May',
        "Potholes": 350
      }
    },
    {
      "attributes": {
        "Month": 'June',
        "Potholes": 260
      }
    },
    {
      "attributes": {
        "Month": 'July',
        "Potholes": 190
      }
    },
    {
      "attributes": {
        "Month": 'August',
        "Potholes":180
      }
    }
  ]
}

export default Ember.Component.extend({
  statusChart: new Cedar({
    "type": "bar",
    "specification": 'https://raw.githubusercontent.com/Esri/cedar/develop/src/charts/bar.json',
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
    "specification": 'https://raw.githubusercontent.com/Esri/cedar/develop/src/charts/bar-horizontal.json',
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
  potholeChart: new Cedar({
    "type": "bar",
    "dataset":{
      "data": potholeData,
      "mappings":{
        "x": {"field":"Month","label":"Month (2015)"},
        "y": {"field":"Potholes","label":"Potholes Filled"}
      }
    },
    "specification": 'https://raw.githubusercontent.com/Esri/cedar/develop/src/charts/bar.json'
  }),


  didInsertElement: function(param){ 
    
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

    console.log('this[this.element.id]', this[this.element.id]);
    this[this.element.id].show({ elementId: '#'+this.element.id, height: 300 });
  }
});