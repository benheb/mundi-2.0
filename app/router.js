import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('catalog');
  this.route('my-data');
  this.route('developers');
  this.route('help');
  this.route('contact');
});

export default Router;
