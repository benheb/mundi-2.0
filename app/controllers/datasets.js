import Ember from 'ember';

export default Ember.Controller.extend({

  // Here, we're telling the controller that the property `page`
  // should be "bound" to the query parameter the same name.
  // We could map the parameter to a different property name if we wanted.
  

  // defaults
  page: 1,
  q: null,
  keyword: null,
  perPage: 5,

  // These properties will be set by the parent route
  totalCount: null,
  count: null,

  tags: null,

  // The following properties will be used for the display of the pagination links
  totalPages: Ember.computed('totalCount', function() {
    return Math.ceil(this.get('totalCount') / this.get('perPage'));
  }),

  showPagination: Ember.computed('totalPages', function () {
    return this.get('totalPages') > 1;
  }),

  showRequestDataset: Ember.computed('totalCount', function () {
    return this.get('totalCount') === 0;
  }),  

  prevPage: Ember.computed('page', function() {
    return this.get('page') - 1;
  }),

  nextPage: Ember.computed('page', function() {
    return this.get('page') + 1;
  }),

  isFirstPage: Ember.computed('page', function() {
    return this.get('page') === 1;
  }),

  isLastPage: Ember.computed('page', 'totalPages', function() {
    return this.get('page') >= this.get('totalPages');
  }),

  pageRange: Ember.computed('page', 'totalPages', function () {
    let result = Ember.A();

    let currentPage = this.get('page');
    let totalPages = this.get('totalPages');

    let start = (totalPages > 10 && currentPage > 6) ? currentPage - 5 : 1;
    let end = (totalPages > start + 9) ? start + 9 : totalPages;

    for(let i = start; i <= end; i++) {
      result.push({ page: i, className: (i === currentPage) ? 'active' : '' });
    }

    return result;
  }),


  actions: {
    doSearch (queryParams) {
      this.transitionToRoute('datasets', { queryParams: queryParams });
    }
  }

});
