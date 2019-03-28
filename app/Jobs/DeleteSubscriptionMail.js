'use strict'

const Mail = use('Mail')

class DeleteSubscriptionMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'DeleteSubscriptionMail-job'
  }

  // This is where the work is done.
  async handle ({ email, username, title, dateEvent }) {
    console.log(`Job: ${DeleteSubscriptionMail.key}`)

    await Mail.send(
      ['emails.delete_subscription'],
      { username, title, dateEvent },
      message => {
        message
          .to(email)
          .from('subscription@teste.com.br', 'Unsubscribe | Rocketseat')
          .subject('Unsubscribe Success ')
      }
    )
  }
}

module.exports = DeleteSubscriptionMail
