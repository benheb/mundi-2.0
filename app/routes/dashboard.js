import Ember from 'ember';
import ajax from 'ic-ajax';

var items = [{
    title: "Alley Repair",
    count: ""
  }, {
    title: "Pothole",
    count: ""
  }, {
    title: "Dead Animal Collection",
    count: ""
  }, {
    title: "Streetlight Repair Investigation",
    count: ""
  }, {
    title: "Tree Inspection",
    count: ""
  }, {
    title: 'Bulk Collection',
    count: ''
  }, {
    title: 'Vision Zero Safety (Transportation) Reports',
    count: ''
  },
  {
    title: 'Number of Green Sites and Resources',
    count: ''
  }
];

export default Ember.Route.extend({
  model: function() {
    callAjax();
    return {'items': items};
  }
});

function callAjax() {


  //311 stats 
  $.when($.ajax({
    url: 'http://services.arcgis.com/bkrWlSKcjUDFDtgw/ArcGIS/rest/services/All_Service_Requests_Last_30_Days/FeatureServer/0/query?where=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=SERVICEC_1&outStatistics=%5B%7B%0D%0A++++%22statisticType%22%3A+%22count%22%2C%0D%0A++++%22onStatisticField%22%3A+%22SERVICEC_1%22%2C+%0D%0A++++%22outStatisticFieldName%22%3A+%22SERVICE_count%22%0D%0A%7D%5D&resultOffset=&resultRecordCount=10&returnZ=false&returnM=false&quantizationParameters=&f=json',
    type: 'GET',
    async: false

  })).then(function(result) {
    var output = JSON.parse(result);
    $.each(output.features, function(i, feature) {
      $.each(items, function(j, item) {
        if ( feature.attributes.SERVICEC_1 === item.title ) {
          Ember.set(item, 'count', feature.attributes.SERVICE_count.toLocaleString());
        }
      })
    });
  });


  $.when($.ajax({
    url: 'http://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/Vision_Zero_Safety_Transportation/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=json',
    type: 'GET',
    async: false

  })).then(function(result) {
    var output = JSON.parse(result);
    $.each(items, function(j, item) {
      if ( item.title === 'Vision Zero Safety (Transportation) Reports') {
        Ember.set(item, 'count', output.count.toLocaleString());
      }
    });
  });

  $.when($.ajax({
    url: 'http://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/Green_Sites_or_Resources/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=json',
    type: 'GET',
    async: false

  })).then(function(result) {
    var output = JSON.parse(result);
    $.each(items, function(j, item) {
      if ( item.title === 'Number of Green Sites and Resources') {
        Ember.set(item, 'count', output.count.toLocaleString());
      }
    });
  });


}
