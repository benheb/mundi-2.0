import Ember from 'ember';

var items = [{
    title: "Alley Repair",
    count: ""
  }, {
    title: "Parking Meter Repair",
    count: ""
  }, {
    title: "Potholes Filled",
    count: ""
  }, {
    title: "Dead Animal Collection",
    count: ""
}];

export default Ember.Route.extend({
  model() {
    callAjax();
    return items;
  }
});

function callAjax() {

  //stats are broken for this service, so have to make a separate request for each count
  //for dashboard

  var fields = [
    'Alley Repair',
    'Parking Meter Repair',
    'Pothole', 
    'Dead Animal Collection'
  ];

  $.each(fields, function(i, field) {
    $.when($.ajax({
      url: 'http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_APPS/SR_30days_Open/MapServer/0/query?where=SERVICECODEDESCRIPTION+%3D+%27'+field+'%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=%5B%5D&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=json',
      type: 'GET',
      async: false

    })).then(function(result) {
      var output = JSON.parse(result);
      items[ i ].count = output.count.toLocaleString();
    });
  }); 
}