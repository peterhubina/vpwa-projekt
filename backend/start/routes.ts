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
  Route.get('channels', 'ChannelsController.ts.index')
  Route.get('channels/:id', 'ChannelsController.ts.show')
  Route.get('channels/:id/:n', 'ChannelsController.ts.getMessages')
  Route.delete('channels/:id', 'ChannelsController.ts.delete')
  Route.post('channels/join', 'ChannelsController.ts.join')
  Route.get('channels2/:id/lister', 'ChannelsController.ts.lister')
  Route.post('channels/remove', 'ChannelsController.ts.remove')
  Route.post('channels/kick', 'ChannelsController.ts.kick')

  Route.post('messages', 'MessagesController.create')
  Route.post('getmessages', 'MessagesController.show')
  Route.post('status', 'UsersController.status')
}).middleware('auth')
