import Ember from 'ember';

export default Ember.Component.extend({

  filterMin: null,
  filterMax: null,

  didInsertElement(model, selectedAttribute) {
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
    let selectedField = this.get('selectedAttribute');
    let fields = this.model.get('fields');
    
    let field = null;
    fields.forEach(function(f) {
      console.log('f.stats', f.alias, ': ', f.statistics);
      if ( f.alias === selectedField ) {
        this.set('filterMin', f.statistics.min);
        this.set('filterMax', f.statistics.max);
      }
    }.bind(this));
  }

});
