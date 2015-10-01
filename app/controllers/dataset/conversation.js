import Ember from 'ember';

export default Ember.Controller.extend({

  needs: [ 'dataset' ],

  showAnnotationOptions: true,

  annotationType: 'marker',

  actions: {
    toggleAnnotationOptions (val) {
      var show = (val === 'yes') ? true : false;
      this.set('showAnnotationOptions', show);
    },

    drawPoint () {
      this.get('controllers.dataset').set('drawingToolsAreActivated', true);
    },

    foobar(a) {
      alert(a);
    }
  }

});
