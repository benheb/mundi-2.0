import DS from 'ember-data';
import ENV from 'opendata-tng/config/environment';

export default DS.JSONAPIAdapter.extend({
  host: ENV.APP.API
});
