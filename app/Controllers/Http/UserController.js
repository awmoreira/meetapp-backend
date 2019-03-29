'use strict'

// const Database = use('Database')
const User = use('App/Models/User')
const Preference = use('App/Models/Preference')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])
    const preference = request.input('preference')

    const user = await User.create(data)
    if (preference) {
      await user.preference().create(preference)
    }

    return user
  }

  async verifyPreferences ({ auth }) {
    const preferences = await Preference.findByOrFail('user_id', auth.user.id)

    return preferences
  }

  async update ({ request, auth }) {
    const user = await User.findOrFail(auth.user.id)
    const data = request.only(['username', 'email', 'password'])
    const preference = request.input('preference')

    user.merge(data)

    if (preference) {
      await user
        .preference()
        .where('user_id', auth.user.id)
        .update(preference)
    }

    user.preference = preference

    return user
  }
}

module.exports = UserController
