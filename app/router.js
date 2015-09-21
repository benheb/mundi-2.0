import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('dashboard');
  this.resource('datasets', function () {});
  this.resource('dataset', { path: '/datasets/:id' }, function () {
    this.route('overview', { path: '/' });
    this.route('data');
    this.route('chart');
  });

  this.route('narrative', {
    path: '/narrative/:id'
  });
});

export default Router;
