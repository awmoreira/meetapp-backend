'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with subscriptions
 */

const Subscription = use('App/Models/Subscription')

class SubscriptionController {
  /**
   * Show a list of all subscriptions.
   * GET subscriptions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params, request }) {
    const { page } = request.get()

    const subscriptions = await Subscription.query()
      .where('meetup_id', params.meetups_id)
      .with('user')
      .with('meetup')
      .paginate(page)

    return subscriptions
  }

  /**
   * Create/save a new subscription.
   * POST subscriptions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ params, auth, response }) {
    // verificar se já existe a inscrição
    // utilizar transaction (possibilidade)

    const subscription = await Subscription.create({
      user_id: auth.user.id,
      meetup_id: params.meetups_id
    })

    return subscription
  }

  /**
   * Display a single subscription.
   * GET subscriptions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const subscription = await Subscription.findOrFail(params.id)

    return subscription
  }

  /**
   * Delete a subscription with id.
   * DELETE subscriptions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const subscription = await Subscription.findOrFail(params.id)

    await subscription.delete()
  }
}

module.exports = SubscriptionController
