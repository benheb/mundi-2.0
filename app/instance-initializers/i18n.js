export default {
  name: 'i18n',
  initialize: function(application) {
    var svc = application.container.lookup('service:i18n')
    var locale = this.calculateLocale(svc);
    svc.set('locale', locale);
  },

  calculateLocale: function (svc) {
    var nav = window.navigator,
      browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
      i,
      language;

    // support for HTML 5.1 "navigator.languages"
    if (Array.isArray(nav.languages)) {
      for (i = 0; i < nav.languages.length; i++) {
        language = nav.languages[i];
        if (language && language.length) {
          return language;
        }
      }
    }

    // support for other well known properties in browsers
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
      language = nav[browserLanguagePropertyKeys[i]];
      if (language && language.length) {
        return language;
      }
    }

    return svc.get('locale');
  }
}
