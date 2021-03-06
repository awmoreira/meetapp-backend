'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MeetupSchema extends Schema {
  up () {
    this.create('meetups', table => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('file_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('preference_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('preferences')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('locale').notNullable()
      table.timestamp('date_event').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('meetups')
  }
}

module.exports = MeetupSchema
