'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Preference extends Model {
  user () {
    return this.hasOne('App/Models/User')
  }

  meetup () {
    return this.hasOne('App/Models/Meetup')
  }
}

module.exports = Preference
