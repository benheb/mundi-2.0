import Ember from 'ember';

export default Ember.Component.extend({

  filterMin: null,
  filterMax: null,
  selectedAttribute: '',

  didInsertElement() {
    var self = this;

    this._getValues();

    Ember.$( "#mundi-filter-slider" ).slider({
      range: true,
      min: self.get('filterMin'),
      max: self.get('filterMax'),
      values: [ self.get('filterMin'), self.get('filterMax') ],
      slide: function( event, ui ) {
        self.set('filterMin', ui.values[0]);
        self.set('filterMax', ui.values[1]);
      }
    });

  },

  selectedAttributeChanged: function() {
    this._getValues();
    Ember.$( "#mundi-filter-slider" ).slider('option',
      { min: this.get('filterMin'), max: this.get('filterMax')}
    );
    Ember.$( "#mundi-filter-slider" ).slider('values',0,this.get('filterMin'));
    Ember.$( "#mundi-filter-slider" ).slider('values',1,this.get('filterMax'));
    
  }.observes('selectedAttribute'),

  _getValues: function() {
    let self = this;
    let selectedField = this.get('selectedAttribute');
    let fields = this.model.get('fields');
    
    fields.forEach(function(f) {
      if ( f.alias === selectedField ) {
        let min = parseFloat(f.statistics.min.toFixed(4));
        let max = parseFloat(f.statistics.max.toFixed(4));
        self.set('filterMin', min);
        self.set('filterMax', max);
      }
    });
  },

  actions: {
    rangeOver: function() {
      this.sendAction('rangeOver', '');
    },
    rangeOut: function() {
      this.sendAction('rangeOut', '');
    }
  }

});
