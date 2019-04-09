'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with meetups
 */

const Meetup = use('App/Models/Meetup')

class MeetupController {
  /**
   * Show a list of all meetups.
   * GET meetups
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request }) {
    const { page } = request.get()

    const meetups = await Meetup.query()
      .with('user')
      .with('subscriptions')
      .paginate(page)

    return meetups
  }

  /**
   * Create/save a new meetup.
   * POST meetups
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only([
      'title',
      'description',
      'locale',
      'preference',
      'date_event',
      'file_id'
    ])

    const meetup = await Meetup.create({ ...data, user_id: auth.user.id })

    return meetup
  }

  /**
   * Display a single meetup.
   * GET meetups/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const meetup = await Meetup.findOrFail(params.id)

    await meetup.load('user')
    await meetup.load('subscriptions')

    return meetup
  }

  /**
   * Update meetup details.
   * PUT or PATCH meetups/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, auth, response }) {
    const meetup = await Meetup.findOrFail(params.id)

    const data = request.only([
      'title',
      'description',
      'locale',
      'preference',
      'date_event',
      'file_id'
    ])

    if (meetup.user_id !== auth.user.id) {
      return response
        .status(401)
        .send({ error: { message: 'Only the creator user can update.' } })
    }

    meetup.merge(data)

    await meetup.save()

    return meetup
  }

  /**
   * Delete a meetup with id.
   * DELETE meetups/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const meetup = await Meetup.findOrFail(params.id)

    await meetup.delete()
  }
}

module.exports = MeetupController
