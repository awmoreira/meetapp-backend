'use strict'

const Hash = use('Hash')
const User = use('App/Models/User')
const Preference = use('App/Models/Preference')

class UserController {
  async changePassword ({ request, auth, response }) {
    const user = auth.current.user

    const isSame =
      !!request.input('password') === request.input('password_confirmation')

    if (!isSame) {
      return response
        .status(401)
        .send({ error: { message: 'Password does not match.' } })
    }

    user.password = await Hash.make(request.input('password'))
    await user.save()

    return user
  }

  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])
    const preference = request.input('preference')

    const user = await User.create(data)
    if (preference) {
      await user.preference().create(preference)
    }

    return user
  }

  async show ({ auth }) {
    const user = await User.findByOrFail('id', auth.user.id)

    await user.load('preference')

    return user
  }

  async update ({ request, auth, response }) {
    const data = request.only(['username', 'password'])
    const preference = request.input('preference')

    const user = await User.findByOrFail('id', auth.user.id)

    const existPref = await Preference.query()
      .where('user_id', auth.user.id)
      .fetch()

    if (existPref.rows.length === 0) {
      await user.preference().create(preference)
    } else {
      await user
        .preference()
        .where('user_id', auth.user.id)
        .update(preference)
    }

    user.merge(data)
    await user.save()

    await user.load('preference')

    return user
  }
}

module.exports = UserController
