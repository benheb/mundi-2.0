import Ember from 'ember';

export default Ember.Controller.extend({

  showAnnotationOptions: true,

  actions: {
    toggleAnnotationOptions (val) {
      var show = (val === 'yes') ? true : false;
      this.set('showAnnotationOptions', show);
    }
  }

});
