import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function(param){ 
    let selectedAttribute = this.get('selectedAttributeName');
    
    let chart = new Cedar({
      "type": "bar",
      "specification": 'bar.json',
      "dataset": {
        "url":"https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/2012_CA_NHTSA/FeatureServer/0",
        "query": {
          "groupByFieldsForStatistics":selectedAttribute,
          "outStatistics": [{
            "statisticType": "count", 
            "onStatisticField":selectedAttribute, 
            "outStatisticFieldName":selectedAttribute + "_count"
          }]
        },
        "mappings":{
          "x": {"field":selectedAttribute,"label":selectedAttribute},
          "y": {"field":selectedAttribute + "_count","label":"Count"}
        }
      }
    })

    chart.override = {
      'marks': [
        { 'properties': {
            'hover': {'fill': { 'value': '#2B4888'}},
            'update': {'fill': { 'value': '#2B4888'}}
          }
        }
      ]
    }

    chart.show({ elementId: '#od-attr-chart', height: 100, width:250 });

  },

  onUpdateChart: function() {
    let selectedAttribute = this.get('selectedAttributeName');
    
    let chart = new Cedar({
      "type": "bar",
      "specification": 'bar.json',
      "dataset": {
        "url":"https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/2012_CA_NHTSA/FeatureServer/0",
        "query": {
          "groupByFieldsForStatistics":selectedAttribute,
          "outStatistics": [{
            "statisticType": "count", 
            "onStatisticField":selectedAttribute, 
            "outStatisticFieldName":selectedAttribute + "_count"
          }]
        },
        "mappings":{
          "x": {"field":selectedAttribute,"label":selectedAttribute},
          "y": {"field":selectedAttribute + "_count","label":"Count"}
        }
      }
    })

    chart.override = {
      'marks': [
        { 'properties': {
            'hover': {'fill': { 'value': '#2B4888'}},
            'update': {'fill': { 'value': '#2B4888'}}
          }
        }
      ]
    }

    chart.show({ elementId: '#od-attr-chart', height: 100, width:250 });
  }.observes('selectedAttributeName')

});
