import Ember from 'ember';
import ajax from 'ic-ajax';

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
  }, {
    title: "Streetlight Repair Investigation",
    count: ""
  }, {
    title: "Illegal Dumping",
    count: ""
  }, {
    title: "Tree Inspection",
    count: ""
  }, {
    title: "Bulk Collection",
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
    'Dead Animal Collection',
    'Streetlight Repair Investigation',
    'Illegal Dumping',
    'Tree Inspection',
    'Bulk Collection'
  ];

  fields.forEach(function (field, i) {
    ajax({
      url: 'http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_APPS/SR_30days_Open/MapServer/0/query?where=SERVICECODEDESCRIPTION+%3D+%27'+field+'%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=%5B%5D&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=json',
      dataType: 'json'
    })
      .then(function (result) {
        Ember.set(items[i], 'count', result.count);
      });
  });
}
