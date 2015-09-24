import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'opendata-tng/config/environment';

export default Ember.Component.extend({

  tagName: 'a',

  attributeBindings: [ 'href', 'target', 'download' ],

  href: Ember.computed('model.id', 'fileExt', function () {
    let model = this.get('model');
    let url = ENV.APP.API;
    url += DS.JSONAPIAdapter.prototype.buildURL('dataset', model.get('id'));
    url += this.get('fileExt');
    return url;
  }),

  target: '_blank',

  fileType: '',

  fileExt: Ember.computed('fileType', function () {
    var fileType = this.get('fileType');
    return (fileType) ? '.' + fileType : '';
  }),  

  download: Ember.computed('model.name', function () {
    return this.get('model.name').underscore() + this.get('fileExt');
  }),

  click() {
    this.sendAction('action', this.get('model'), this.get('href'));
    return false;
  }

});
