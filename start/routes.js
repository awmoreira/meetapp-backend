'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.get('files/:id', 'FileController.show')

Route.group(() => {
  Route.post('files', 'FileController.store')
  Route.delete('files/:id', 'FileController.destroy')
  Route.get('users', 'UserController.show')
  Route.put('users', 'UserController.update')
  Route.put('users', 'UserController.changePassword')

  Route.resource('meetups', 'MeetupController')
    .apiOnly()
    .validator(new Map([[['meetups.store'], ['Meetup']]]))

  Route.resource('meetups.subscriptions', 'SubscriptionController').apiOnly()
}).middleware(['auth'])
