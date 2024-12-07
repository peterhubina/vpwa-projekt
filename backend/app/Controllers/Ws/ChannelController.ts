import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class ChannelController {
  constructor() {}

  public async delete({ params, auth, socket }: WsContextContract) {
    const channel = await Channel.query().where('name', params.name).firstOrFail()
    if (channel.ownerId !== auth.user!.id) {
      throw new Error('You are not the owner of this channel')
    }
    socket.broadcast.emit('channelDeleted', channel)
    await channel.delete()
    return channel
  }

  public async getUsers({ params }: HttpContextContract) {
    const channel = await Channel.query().where('name', params.name).firstOrFail()
    const users = await channel.related('users').query()
    //console.log('Users: ', users)
    return users
  }

  public async leave({ auth, socket, params }: WsContextContract) {
    console.log(params)
    // find channel by name
    const channel = await Channel.query().where('name', params.name).firstOrFail()
    if (channel.ownerId === auth.user!.id) {
      await channel.delete()
      socket.broadcast.emit('channelDeleted', channel)
    } else {
      await auth.user!.related('channels').detach([channel.id])
      socket.broadcast.emit('channelLeft', channel)
    }
    return channel
  }

  public async invite({ auth, request, params }: WsContextContract) {
    console.log('first')
    // find by channel name
    const channel = await auth
      .user!.related('channels')
      .query()
      .where('name', params.name)
      .firstOrFail()
    const invitedUser = await User.findByOrFail('username', request.body().username)
    console.log('second')
    if (channel.isPrivate) {
      if (auth.user!.id !== channel.ownerId)
        throw new Error('You are not the owner of this channel')
      await invitedUser.related('channels').attach({
        [channel.id]: {
          invited: true,
        },
      })
      return { success: false }
    }

    const reports = await channel
      .related('reports')
      .query()
      .wherePivot('reported_user_id', invitedUser.id)

    // Owner invited user
    if (auth.user!.id === channel.ownerId) {
      await invitedUser.related('channels').attach({
        [channel.id]: {
          invited: true,
        },
      })

      await channel
        .related('reports')
        .query()
        .wherePivot('reported_user_id', invitedUser.id)
        .delete()
      return { invitedUser }
    }

    console.log(reports[0])

    // User invited user
    if (
      reports.length >= 3 ||
      reports.find((report) => channel.ownerId === report.$extras.pivot_user_id)
    ) {
      throw new Error('User is banned from this channel')
    }
    await invitedUser.related('channels').attach({
      [channel.id]: {
        invited: true,
      },
    })
    return { invitedUser }
  }

  public async printTyping({socket, params }: WsContextContract, channel: any, user: any, messagebeingtyped: string) {
    console.log('print typing', params)
    socket.broadcast.emit('printTyping', channel, user, messagebeingtyped)
  }
}
