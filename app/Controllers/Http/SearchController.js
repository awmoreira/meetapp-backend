'use strict'

const Database = use('Database')

class SearchController {
  async index ({ request }) {
    const { search, table, field } = request.all()

    let meetups = await Database.select('*')
      .from(table)
      .where(field, 'ILIKE', '%' + search + '%')

    return meetups
  }
}

module.exports = SearchController
