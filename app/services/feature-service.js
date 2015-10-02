import Ember from 'ember';
import ajax from 'ic-ajax';
//import FeatureService from '';

export default Ember.Service.extend({


  // NOTE: this needs a refactor


  _getQueryUrl: function (dataset, params) {
    let url = dataset.get('url');
    url += '/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';

    let supportsPagination = Ember.get(dataset, 'advancedQueryCapabilities.supports_pagination');

    if (supportsPagination) {
      let perPage = params.perPage;
      url += '&resultOffset=' + (params.page - 1) * perPage;
      url += '&resultRecordCount=' + perPage;
      //NOTE: when you pass in one of the above two parameters and orderByFields is left empty, 
      //map service uses the object-id field to sort the result. 
      //For a query layer with a pseudo column as the object-id field (e.g., FID), 
      //you must provide orderByFields; otherwise the query fails
    }

    let orderBy = params.orderBy;
    if (!params.orderByAsc) {
      orderBy += ' desc';
    }
    //NOTE: this still could fail 
    //if the oid field has changed since it was harvested by open data
    //or it is null (which should not happen...)
    url += '&orderByFields=' + orderBy;

    return url;
  },

  fetchPage: function (dataset, params) {
    let url = this._getQueryUrl(dataset, params);

    return ajax({
      url: url,
      dataType: 'json',
    });
  },

  fetch: function (url, params) {
    url += '/query?text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson&orderByFields=createdAt';


    /*
      TODO:
        get token from cookie (still temporary but...)
        conversation item component
        construct where clause from params
    */

    url += '&where=datasetId%3D\'' + params.datasetId + '\'';


    var token = 'lBwSQUn9v-dmNH8cO56Pir1fIdr94uFC5ywzT6WwkqIpJHdszfHffZhqswJxxlnpyqjWPVhnXi48sfhREEcLdEUtNuH_tzMk4ptY52ze4ghtPaMyFoJHanSFKZoBtLLyWFOA3tfNnEeYDpUlZYL89kn_eDtRfOJ5vI4mCTFdGovP9ueP3eZ4a54t1z7wxP8i';
    url += '&token=' + token;

    return ajax({
      url: url,
      dataType: 'json',
    });
  }

});
