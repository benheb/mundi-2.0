import Ember from 'ember';
import { request } from 'ic-ajax';
const { keys } = Ember;

//const PATH = '/my/api/translations.json';

export default {

  name: 'i18n',

  initialize(application) {
    let svc = application.container.lookup('service:i18n');
    let locale = this._calculateLocale();
    // if we got null, we want to use the default locale
    // which we should already have in the browser...
    if (locale && locale !== svc.get('locale'))
    this._fetchTranslation(locale).then(function (resp) {
      svc.addTranslations(locale, resp);
      svc.set('locale', locale);
    }.bind(this));
  },

  _fetchTranslation(locale) {
    const url = '/locales/' + locale + '/translations.json';
    return request(url);
  },

  _calculateLocale() {
    var nav = window.navigator,
      browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
      i,
      language;

    // support for HTML 5.1 "navigator.languages"
    if (Array.isArray(nav.languages) && nav.languages.length > 0) {
      language = nav.languages[0];
      if (language && language.length) {
        return language;
      }
    }

    // support for other well known properties in browsers
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
      language = nav[browserLanguagePropertyKeys[i]];
      if (language && language.length) {
        return language;
      }
    }

    return null;
  }
};
