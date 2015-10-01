import Ember from 'ember';

//export default Ember.Helper.helper(params => params.toLocaleString());

export function formatNumber(params, hash) {
  return params.toLocaleString();
}

export default Ember.Helper.helper(formatNumber);
