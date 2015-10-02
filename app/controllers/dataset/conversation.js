import Ember from 'ember';

export default Ember.Controller.extend({

  datasetController: Ember.inject.controller('dataset'),

  showAnnotationOptions: true,

  annotationType: 'marker',

  actions: {
    toggleAnnotationOptions (val) {
      var show = (val === 'yes') ? true : false;
      this.set('showAnnotationOptions', show);
    },

    drawPoint () {
      this.get('datasetController').set('drawingToolsAreActivated', true);
    },

    foobar(a) {
      alert(a);
    }
  }

});
