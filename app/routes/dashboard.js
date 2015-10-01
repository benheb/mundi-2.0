import Ember from 'ember';
//import ajax from 'ic-ajax';

// NOTE: we should use ic-ajax and Ember.RSVP

var items = [
  {
    title: 'Currently in D.C.',
    count: '',
    itemId: '',
    description: ''
  }, {
    title: "311 Service Requests",
    count: "",
    itemId: '14faf3d4bfbe4ca4a713bf203a985151_0',
    description: 'in the past 30 days'
  }, {
    title: 'Key Performance Indicators',
    count: '744',
    itemId: 'aab8213fd7de4e548ffecdd4820815a3_0',
    description: '<i class="glyphicon glyphicon-arrow-up"></i> up from last year'
  }, {
    title: 'Crime Incidents',
    count: '1,208',
    itemId: '',
    description: '<i class="glyphicon glyphicon-arrow-down"></i> down from last month'
  }, {
    title: 'Capital Projects',
    count: '69',
    itemId: 'ff2e0d5bcdda4c7d93dd36051cd79521_24',
    description: 'projects from 5 agencies'
  }, {
    title: 'Public Schools',
    count: '42,240',
    itemId: '4ac321b2d409438ebd76a6569ad94034_5',
    description: 'students enrolled'
  }, {
    title: 'Vision Zero',
    count: '',
    itemId: '3f28bc3ad77f49079efee0ac05d8464c_0',
    description: 'safety reports in the past three months'
  },
  {
    title: 'Green Sites',
    count: '',
    itemId: '9927e456ac024b11811323812934edbb_12',
    description: 'green amenities in the district'
  }
];

export default Ember.Route.extend({
  actions: {
    gotoNarrative: function (itemId) {
      console.log('HERE?! item id', itemId);
      this.controllerFor('dashboard').transitionToRoute('narrative', itemId);
    }
  },

  model: function() {
    callAjax();
    console.log('items', items);
    return {'items': items};
  }
});

function callAjax() {


  Ember.$.getJSON( "http://api.wunderground.com/api/2d16ecfa44430b7f/conditions/q/DC/Washington.json", function( data ) {
    var temp = data.current_observation.temp_f;
    var weather = data.current_observation.weather;
    Ember.set(items[0], 'count', Math.round(temp) + '&deg;');
    Ember.set(items[0], 'description', 'Weather: '+ weather);
  });


  //311 stats 
  Ember.$.when(Ember.$.ajax({
    url: 'http://services.arcgis.com/bkrWlSKcjUDFDtgw/ArcGIS/rest/services/All_Service_Requests_Last_30_Days/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=10&returnZ=false&returnM=false&quantizationParameters=&f=json',
    type: 'GET',
    async: false

  })).then(function(result) {
    var output = JSON.parse(result);
    Ember.set(items[1], 'count', output.count.toLocaleString());
  });


  Ember.$.when(Ember.$.ajax({
    url: 'http://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/Vision_Zero_Safety_Transportation/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=json',
    type: 'GET',
    async: false

  })).then(function(result) {
    var output = JSON.parse(result);
    Ember.$.each(items, function(j, item) {
      if ( item.title === 'Vision Zero') {
        Ember.set(item, 'count', output.count.toLocaleString());
      }
    });
  });

  Ember.$.when(Ember.$.ajax({
    url: 'http://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/Green_Sites_or_Resources/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=json',
    type: 'GET',
    async: false

  })).then(function(result) {
    var output = JSON.parse(result);
    Ember.$.each(items, function(j, item) {
      if ( item.title === 'Green Sites') {
        Ember.set(item, 'count', output.count.toLocaleString());
      }
    });
  });


}
