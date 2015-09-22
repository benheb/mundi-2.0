import Ember from 'ember';
import Ladda from 'ladda';

export default Ember.Component.extend({

  didInsertElement() {
    //ladda expects a data attribute - style
    this.element.dataset.style = this.get('style');
    this.l = Ladda.create(this.element);
  },

  style: 'expand-left',

  tagName: 'button',

  showLoading: false,

  classNames: ['ladda-button'],

  showLoadingDidChange: function() {
    let method = this.get('showLoading') ? 'start' : 'stop';
    this.l[method]();
  }.observes('showLoading')

});
