'use strict'

const Hash = use('Hash')
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

    const isSame = !!data.password === data.password_confirmation
    // const isSame = await Hash.verify('plain-value', 'hashed-value')

    // if (isSame) {
    //   // ...
    // }

    console.log(isSame)

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
