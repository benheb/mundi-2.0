import Ember from 'ember';
import ajax from 'ic-ajax';

var items = [{
    title: "Alley Repair",
    count: ""
  }, {
    title: "Parking Meter Repair",
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
    title: "Illegal Dumping",
    count: ""
  }, {
    title: "Tree Inspection",
    count: ""
  }, {
    title: "Bulk Collection",
    count: ""
}];

var data = [
  {  "letter":"A", "frequency":0.01492 },
  {  "letter":"B", "frequency":0.08167 },
  {  "letter":"C", "frequency":0.02780 },
  {  "letter":"D", "frequency":0.04253 },
  {  "letter":"E", "frequency":0.12702 },
  {  "letter":"F", "frequency":0.02288 },
  {  "letter":"G", "frequency":0.02022 },
  {  "letter":"H", "frequency":0.06094 },
  {  "letter":"I", "frequency":0.06973 },
  {  "letter":"J", "frequency":0.00153 },
  {  "letter":"K", "frequency":0.00747 }
];

export default Ember.Route.extend({
  model: function() {
    callAjax();
    return {'items': items, 'data': data};
  }
});

function callAjax() {

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

}
