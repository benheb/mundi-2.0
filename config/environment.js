/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'opendata-tng',
    environment: environment,
    rootUrl: '/', //assets
    baseURL: '/', //app
    locationType: 'auto',

    i18n: {
      defaultLocale: 'en'
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "* 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com",
      'font-src': "* data: use.typekit.net",
      'connect-src': "*",
      'img-src': "*",
      'style-src': "* 'unsafe-inline' use.typekit.net",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com"
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      
      API: 'http://opendata.dc.gov',
      agoUrl: 'http://www.arcgis.com',
      annotationServiceUrl: 'http://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/opendata_comments/FeatureServer/0'

      // API: 'http://opendataqa.arcgis.com',
      //agoUrl: 'http://qaext.arcgis.com'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production' || environment === 'prod') {
    ENV.baseUrl = '/opendata-tng';
    ENV.rootUrl = '/opendata-tng';

    // ENV.APP.API = 'http://opendata.dc.gov';

    ENV.APP.API = 'http://opendata.dc.gov';
    ENV.APP.agoUrl = 'http://www.arcgis.com';

    ENV.locationType = 'hash';
  }

  return ENV;
};
