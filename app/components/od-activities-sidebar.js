// import Ember from 'ember';
import Base from './od-sidebar';

export default Base.extend({
  actions: {
    favoriteSelected (id) {
      this.sendAction('action', id);
    }
  }
});
