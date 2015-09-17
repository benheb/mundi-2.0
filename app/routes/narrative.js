import Ember from 'ember';

var json = {
  '14faf3d4bfbe4ca4a713bf203a985151_0': {
    'name': 'All Service Requests - Last 30 Days',
    'description': 'This data layer shows 311 Service Requests in the last 30 days for all service request types.',
    'section1': {
      'section_title': 'Your city at work',
      'feature1': {
        'feature_type': 'stat',
        'feature_number': 451,
        'feature_title': 'Potholes Filled Last 30 Days',
        'feature_sub_title': '<i class="glyphicon glyphicon-arrow-up green"></i> up 55% from last month'
      },
      'feature2': {
        'type': 'chart',
        'feature_chart_id': 'potholeChart',
        'feature_title': 'Number of Potholes Filled in D.C. by Month',
        'feature_data': {}
      }
    }
  }
}

export default Ember.Route.extend({

  model: function (params) {
    //return this.store.findRecord('dataset', params.id);
    return json[params.id];
  }

});
