'use strict'

const Antl = use('Antl')

class Meetup {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      description: 'required',
      locale: 'required',
      date_event: [
        Validator.rule('required'),
        Validator.rule('date'),
        Validator.rule('dateFormat', 'YYYY-MM-DD HH:mm:ss'),
        Validator.rule('after', new Date())
      ],
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Meetup
