'use strict'

const Database = use('Database')
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

  async show ({ auth }) {
    const user = await User.findByOrFail('id', auth.user.id)

    await user.load('preference')

    return user
  }

  async update ({ request, auth }) {
    const data = request.only(['username', 'password'])
    const preference = request.input('preference')

    const user = await User.findByOrFail('id', auth.user.id)
    await Database.table('preferences')
      .where('user_id', auth.user.id)
      .update({
        front: preference.front,
        back: preference.back,
        mobile: preference.mobile,
        devops: preference.mobile,
        manager: preference.manager,
        marketing: preference.marketing
      })

    user.merge(data)

    await user.save()

    await user.load('preference')

    return user
  }
}

module.exports = UserController
