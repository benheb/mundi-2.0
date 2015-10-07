import Ember from 'ember';

export default Ember.Route.extend({

  selectedAttribute: '',
  selectedAttributeName: '',

  model: function (params) {
    //return params.id;
    //return this.store.query('dataset', {id: params.id});
    return this.store.findRecord('dataset', params.id);
  },

  setupController: function(controller, model) {
    this.model = model; 

    this._super(controller, model);
    controller.set('datasetIds', Ember.A([model]));
    let ctrl = this.controllerFor('application');
    ctrl.set('isFullScreen', true);
    
    let mundiCtrl = this.controllerFor('mundi');
    let field = null, name = null;
    let fields = model.get('fields');
    fields.forEach(function(f) {
      if ( !field && f.statistics.min ) {
        field = f.alias;
        name = f.name;
      }
    });
    mundiCtrl.set('selectedAttribute', field);
    mundiCtrl.set('selectedAttributeName', name);
    mundiCtrl.set('drawMode', 'single');
    mundiCtrl.set('quickTheme', 'Default Theme');
    mundiCtrl.set('fields', fields);
  },

  resetController: function (controller, isExiting, transition) {
    this._super(controller, isExiting, transition); // Do not forget this call
    let ctrl = this.controllerFor('application');
    ctrl.set('isFullScreen', false);
  },

  actions: {
    setSelectedAttribute: function(attr) {
      let ctrl = this.controllerFor('mundi');
      
      ctrl.set('selectedAttribute', attr);
      
      let fields = this.model.get('fields');
      let name = null;
      fields.forEach(function(f) {
        if ( f.alias === attr ) {
          name = f.name;
          ctrl.set('filterMin', f.statistics.min);
          ctrl.set('filterMax', f.statistics.max);
        }
      });

      ctrl.set('selectedAttributeName', name);

    },
    quickThemeChanged: function(theme) {
      let ctrl = this.controllerFor('mundi');
      ctrl.set('quickTheme', theme);
    },
    changeDrawMode: function(mode) {
      let ctrl = this.controllerFor('mundi');
      ctrl.set('drawMode', mode);
    }
  }

});
