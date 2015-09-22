/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    srcTag: 'https://js.arcgis.com/4.0beta1/', // only needed for CDN, will default to 'built.js' if useRequire = true
    amdPackages: [ // user defined AMD packages
      'esri'
    ]
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff', {  
    destDir: 'fonts/bootstrap/'
  });

  app.import('bower_components/bootstrap-sass/assets/javascripts/bootstrap.js');

  app.import('vendor/vega.js');
  app.import('vendor/cedar.min.js');
  app.import('vendor/malette.js');


  return app.toTree();
};
