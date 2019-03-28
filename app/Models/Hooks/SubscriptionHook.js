'use strict'

const Kue = use('Kue')
const JobNew = use('App/Jobs/NewSubscriptionMail')
const JobDelete = use('App/Jobs/DeleteSubscriptionMail')

const SubscriptionHook = (exports = module.exports = {})

SubscriptionHook.sendNewSubscriptionMail = async subscriptionInstance => {
  if (!subscriptionInstance.user_id) return

  const { email, username } = await subscriptionInstance.user().fetch()

  const {
    title,
    date_event: dateEvent
  } = await subscriptionInstance.meetup().fetch()

  Kue.dispatch(
    JobNew.key,
    { email, username, title, dateEvent },
    { attempts: 3 }
  )
}

SubscriptionHook.sendDeleteSubscriptionMail = async subscriptionInstance => {
  if (!subscriptionInstance.user_id) return

  const { email, username } = await subscriptionInstance.user().fetch()

  const {
    title,
    date_event: dateEvent
  } = await subscriptionInstance.meetup().fetch()

  Kue.dispatch(
    JobDelete.key,
    { email, username, title, dateEvent },
    { attempts: 3 }
  )
}
