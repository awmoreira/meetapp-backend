'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with meetups
 */

const Database = use('Database')
const Meetup = use('App/Models/Meetup')
const Preference = use('App/Models/Preference')
const User = use('App/Models/User')

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

  async subscriptions ({ request, auth }) {
    const { page } = request.get()

    const meetups = await Meetup.query()
      .whereHas('subscriptions', builder => {
        builder.where('user_id', auth.user.id)
      })
      .withCount('subscriptions')
      .paginate(page)

    return meetups
  }

  async nexts ({ request, auth }) {
    const { page } = request.get()

    const meetups = await Meetup.query()
      .whereDoesntHave('subscriptions', builder => {
        builder.where('user_id', auth.user.id)
      })
      .withCount('subscriptions')
      .paginate(page)

    return meetups
  }

  async recommended ({ request, auth }) {
    const { page } = request.get()

    const user = await User.findOrFail(auth.user.id)

    const preference = await user.preference().fetch()

    const meetups = await Meetup.query()
      .whereDoesntHave('subscriptions', builder => {
        builder.where('user_id', auth.user.id)
      })
      .whereHas('preference', builder => {
        // builder.orWhere({ front: preference.front, back: preference.back })
        builder
          .where('front', preference.front)
          .orWhere('back', preference.back)
      })
      .withCount('subscriptions')
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
  async store ({ request, auth }) {
    const data = request.only([
      'title',
      'description',
      'locale',
      'date_event',
      'file_id'
    ])
    const preference = request.input('preference')

    const trx = await Database.beginTransaction()

    const pref = await Preference.create(preference, trx)

    const meetup = await Meetup.create(
      {
        ...data,
        user_id: auth.user.id,
        preference_id: pref.id
      },
      trx
    )

    await trx.commit()

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
