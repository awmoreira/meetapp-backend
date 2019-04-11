'use strict'

const User = use('App/Models/User')
const Preference = use('App/Models/Preference')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async show ({ auth }) {
    const user = await User.findOrFail(auth.user.id)

    await user.load('preference')

    return user
  }

  async update ({ request, auth }) {
    const data = request.only(['username', 'password'])
    const preference = request.input('preference')

    const user = await User.findByOrFail('id', auth.user.id)
    if (!user.preference_id) {
      const pref = await Preference.create(preference)
      user.preference_id = pref.id
    } else {
      const pref = await Preference.findByOrFail('id', user.preference_id)
      pref.merge(preference)
      await pref.save()
    }

    user.merge(data)
    await user.save()

    await user.load('preference')

    return user
  }
}

module.exports = UserController
