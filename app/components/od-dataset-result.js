import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'li',

  isFavorite: Ember.computed('favorites', function () {
    var favs = this.get('favorites');
    return favs.any(function (item) {
      return item.get('datasetId') === this.model.get('id');
    }.bind(this));
  }),

  favoriteClass: Ember.computed('isFavorite', function () {
    return this.get('isFavorite') ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty';
  }),

  actions: {
    favoriteItem: function (datasetId) {
      this.sendAction('action', datasetId);

      // NOTE: this bothers me - i would think the data binding would take care of this
      //       it does elsewhere...
      this.set('isFavorite', !this.get('isFavorite'));
    }
  }

});
