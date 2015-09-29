import Ember from 'ember';

export default Ember.Controller.extend({

  showAnnotationOptions: true,

  actions: {
    toggleAnnotationOptions () {
      var ctrl = this.controllerFor('dataset');
      ctrl.set('showAnnotationOptions', !ctrl.get('showAnnotationOptions'));
    }
  }

});
