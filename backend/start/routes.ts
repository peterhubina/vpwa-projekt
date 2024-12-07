/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('me', 'AuthController.me').middleware('auth')
}).prefix('auth')

Route.group(() => {
  Route.get('channels', 'ChannelsController.index')
  Route.get('channels/:id', 'ChannelsController.show')
  Route.get('channels/:id/:n', 'ChannelsController.getMessages')
  Route.delete('channels/:id', 'ChannelsController.delete')
  Route.post('channels/join', 'ChannelsController.join')
  Route.get('channels2/:id/lister', 'ChannelsController.lister')
  Route.post('channels/remove', 'ChannelsController.remove')
  Route.post('channels/kick', 'ChannelsController.kick')
  Route.get('channels/:id/users', 'ChannelsController.getUsers')
  Route.get('users/:channelId/kick-votes', 'UsersController.getKickVotes')

  Route.post('messages', 'MessagesController.create')
  Route.post('getmessages', 'MessagesController.show')
  Route.post('status', 'UsersController.status')
  Route.get('status/:userId', 'UsersController.getStatus')
}).middleware('auth')
