import Ember from 'ember';

export default Ember.Controller.extend({

  q: '',

  bodyClass: null,
  subHeaders: {
    'dashboard': 'Community Dashboard',
    'narrative': 'Dataset Narrative'
  },
  subHeader: '',

  currentPathDidChange: function() {
    let path = this.get('currentPath');
    let parts = path.split('.');
    // var className = path.replace(/\./g, '-');
    // if (className !== parts[0]) {
    //   className += ' ' + parts[0];
    // }
    let className = 'page-' + parts[0];
    let sub = this.subHeaders[parts[0]];

    this.set('bodyClass', className);
    this.set('subHeader', sub);

  }.observes('currentPath'),

  actions: {
    search: function(q) {
      this.transitionToRoute('datasets', { queryParams: { q: q, page: 1 } });
    }
  }

});
