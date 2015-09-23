import DS from 'ember-data';

export default DS.Model.extend({
  
  activityType: DS.attr('string'),
  url: DS.attr('string'),
  datasetId: DS.attr('string'),
  createdAt: DS.attr('date', { defaultValue: new Date() })

});
