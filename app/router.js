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
    this.route('conversation');
  });

  this.route('narrative', {
    path: '/narrative/:id'
  });

  this.route('my-data', function () {
    this.route('favorites', { path: '/' });
    this.route('downloads');
    this.route('groups');
    this.route('projects');
  });

  this.route('mundi', {
    path: '/mundi/:id'
  });

  this.route('explore', {
    path: '/explore/:id'
  });

  this.route('dataset-table', function() {
    this.route(':id');
  });
});

export default Router;
