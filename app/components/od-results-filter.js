import Ember from 'ember';

export default Ember.Component.extend({

  /* TODO: 
      not at all sure if the way i'm doing show/hide more is good
      can/should we bind directly to queryParams???
      we are not actually setting the checked attribute on the checkbox - maybe it doesn't matter...
  */

  isShowingAll: false,

  showMoreLabel: function () {
    return this.get('isShowingAll') ? 'Show Fewer' : 'Show More';
  }.property('isShowingAll'),

  showMoreClass: function () {
    return this.get('isShowingAll') ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down';
  }.property('isShowingAll'),

  viewModels: function () {
    const atLeast = 5;
    
    let model = this.get('model');
    let isShowingAll = this.get('isShowingAll');

    if (isShowingAll || !model) {
      return model;
    } else {
      let checked = model.filterBy('checked', true).length;
      let showCount = checked > atLeast ? checked : atLeast;
      return model.slice(0, showCount);
    }

  }.property('isShowingAll', 'model.[]'),

  _keyMap: {
    tags: 'keyword'
  },

  actions: {
    change (name, checked) {
      // contstruct a queryparams object to send up to the controller
      var stringAry = this.get('model')
        .filterBy('checked', true)
        .mapBy('name');
      
      if (checked) {
        // we're adding one
        stringAry.push(name);
      } else {
        //we're removing one
        stringAry = stringAry.filter(item => item !== name);
      }

      var queryParams = {
        page: 1
      };

      var key = this._keyMap[this.get('type')];

      queryParams[key] = stringAry.join(',');
      
      this.sendAction('action', queryParams);
    },

    toggleShowAll () {
      this.set('isShowingAll', !this.get('isShowingAll'));
    }
  }

});
