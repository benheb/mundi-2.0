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
    mundiCtrl.set('isFilter', true);
    mundiCtrl.set('filterActive', 'active');
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
    showTransformUI: function() {
      let ctrl = this.controllerFor('mundi');
      ctrl.set('filterActive', '');
      ctrl.set('transformActive', 'active');
      ctrl.set('isFilter', false);
    },
    showFilterUI: function() {
      let ctrl = this.controllerFor('mundi');
      ctrl.set('filterActive', 'active');
      ctrl.set('transformActive', '');
      ctrl.set('isFilter', true);
    },
    buffer: function(params) {
      let ctrl = this.controllerFor('mundi');
      ctrl.set('buffer', params);
    },
    quickThemeChanged: function(theme) {
      let ctrl = this.controllerFor('mundi');
      ctrl.set('quickTheme', theme);
    },
    rangeOver: function() {
      console.log('range over.....');
      let ctrl = this.controllerFor('mundi');
      ctrl.set('showChart', 'visible' );
    },
    rangeOut: function() {
      console.log('range out!.....');
      let ctrl = this.controllerFor('mundi');
      ctrl.set('showChart', 'hidden' );
    },
    changeDrawMode: function(mode) {
      let ctrl = this.controllerFor('mundi');
      ctrl.set('drawMode', mode);
    }
  }

});
