import Ember from 'ember';

export default Ember.Controller.extend({

  // Here, we're telling the controller that the property `page`
  // should be "bound" to the query parameter the same name.
  // We could map the parameter to a different property name if we wanted.
  queryParams: [
    'page',
    'q',
    'keyword'
  ]

});
