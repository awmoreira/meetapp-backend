'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PreferenceSchema extends Schema {
  up () {
    this.create('preferences', table => {
      table.increments()
      table.boolean('front')
      table.boolean('back')
      table.boolean('mobile')
      table.boolean('devops')
      table.boolean('manager')
      table.boolean('marketing')
      table.timestamps()
    })
  }

  down () {
    this.drop('preferences')
  }
}

module.exports = PreferenceSchema
