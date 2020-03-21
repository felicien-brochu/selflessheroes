import format from 'string-template'
import {
  getUserLocales
} from 'get-user-locale'

import enMessages from './messages-en.json'
import frMessages from './messages-fr.json'

const messages = {
  default: 'en',
  supportedLanguages: ['en', 'fr'],

  'en': enMessages,
  'fr': frMessages
}

class Idiom {
  constructor(messages, locales) {
    this.messages = messages
    this.currentLanguage = messages.default

    this.languages = locales.map(l => l.substring(0, 2))
    let supportedLanguage = this.languages.find(lang => !!this.messages[lang])
    if (supportedLanguage) {
      this.currentLanguage = supportedLanguage
    }
  }

  applyLanguagePreference(preferredLanguage) {
    if (!!preferredLanguage && this.messages.supportedLanguages.some(language => language === preferredLanguage)) {
      this.currentLanguage = preferredLanguage
    }
  }

  getMessage(key) {
    let message = this.messages[this.currentLanguage][key]
    if (!message) {
      message = this.messages[this.messages.default][key]

      if (!message) {
        throw new Error(`lang::: message not found [${key}]`)
      }
    }
    return message
  }

  pushMessage(key, message, language = this.messages.default) {
    if (typeof message === 'string' && this.messages.supportedLanguages.some(l => l === language)) {
      this.messages[language][key] = message
    }
  }

  text(key, templateValues) {
    if (templateValues) {
      return this.formatTemplate(key, templateValues)
    } else {
      return this.getMessage(key)
    }
  }

  formatTemplate(templateKey, templateValues) {
    let template = this.getMessage(templateKey)
    let values = {}
    for (let key in templateValues) {
      let templateValue = templateValues[key]
      let value = templateValue
      // the value can be a nested template
      if (typeof value === 'object' && templateValue.template) {
        value = this.text(templateValue.template, templateValue.values)
      }
      values[key] = value
    }

    return format(template, values)
  }
}
export default new Idiom(messages, getUserLocales())