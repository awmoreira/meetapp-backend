'use strict'

const Antl = use('Antl')

class User {
  get validateAll () {
    return true
  }

  get rules () {
    const { user } = this.ctx.auth

    return {
      username: `required|min:5|unique:users,username,id,${user.id}`,
      email: `required|email|unique:users,email,id,${user.id}`,
      password: 'required|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = User
