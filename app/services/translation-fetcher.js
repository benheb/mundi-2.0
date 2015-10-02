import Ember from 'ember';
import { request } from 'ic-ajax';
const { Service, keys, inject } = Ember;

const PATH = '/my/api/translations.json';

export default Service.extend({
  i18n: inject.service(),

  fetch() {
    return request(PATH).then(this._addTranslations.bind(this));
  },

  _addTranslations(json) {
    const i18n = this.get('i18n');

    keys(json).forEach(function(locale) {
      i18n.addTranslations(locale, json[locale]);
    });
  }
});
