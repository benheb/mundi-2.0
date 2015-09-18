import Ember from 'ember';

var json = {
  '14faf3d4bfbe4ca4a713bf203a985151_0': {
    'name': 'All Service Requests - Last 30 Days',
    'description': 'This data layer shows 311 Service Requests in the last 30 days for all service request types.',
    'text1': 'Here we can have a section with a lot of text. The text can explain what kind of data one may find in this dataset. It\'s also a chance for admins to help tell the story of the data, and provide context for what is being shown on the narrative page for each particular dataset.',
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
  },
  '3f28bc3ad77f49079efee0ac05d8464c_0': {
    'name': 'Vision Zero Safety (Transportation)',
    'description': 'Vision Zero Safety data',
    'text1': 'Vision Zero is a part of Mayor Bowser’s response to the US Department of Transportation’s Mayor’s Challenge for Safer People and Safer Streets, which aims to improve pedestrian and bicycle transportation safety by showcasing effective local actions, empowering local leaders to take action, and promoting partnerships to advance pedestrian and bicycle safety. Vision Zero requires an all-hands-on-deck approach. More than 20 District government agencies are engaged in the Vision Zero Initiative, including DDOT, Department of Public Works, the Deputy Mayor for Health and Human Services, Metropolitan Police Department, DC Taxi Cab Commission, the Department of Motor Vehicles, the DC Office on Aging, DC Public Schools, Fire and Emergency Medical Services, Homeland Security and Management, Office of Unified Communications, Department of Health, the Office of the Attorney General, Office of the Chief Technology Officer, Office of Disability Rights, Office of Planning, Office of the City Administrator, Office of the State Superintendent of Education, the Deputy Mayor for Education, Office of Policy and Legislative Affairs, and the Deputy Mayor for Planning and Economic Development.',
    'section2': {
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
    return this.store.findRecord('dataset', params.id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('page', json[model.get('id')]);
  }
  
});
