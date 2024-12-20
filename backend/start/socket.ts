/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'

Ws.namespace('/')
  .connected('ActivityController.onConnected')
  .disconnected('ActivityController.onDisconnected')
  .on('inviteUser', 'ActivityController.inviteUser')
  .on('kickUser', 'ActivityController.kickUser')
Ws.namespace('channels/:name')
  // .middleware('channel') // check if user can join given channel
  .on('loadMessages', 'MessageController.loadMessages')
  .on('addMessage', 'MessageController.addMessage')
  .on('deleteChannel', 'ChannelController.delete')
  .on('leaveChannel', 'ChannelController.leave')
  .on('getUsers', 'ChannelController.getUsers')
  .on('printTyping', 'ChannelController.printTyping')
