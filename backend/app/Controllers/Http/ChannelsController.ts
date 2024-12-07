// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel from 'App/Models/Channel'
import { schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class ChannelsController {
  public async index({ response, auth }: HttpContextContract) {
    const channels = await auth.user!.related('channels').query()
    // get invited
    return response.ok(
      channels.map((channel) => {
        return {
          ...channel.serialize(),
          pivot_invited: channel.$extras.pivot_invited,
        }
      })
    )
  }

  public async show({ params, response, auth }: HttpContextContract) {
    // TODO show only channels that the user is a member of
    console.log(params.id)
    const channel = await auth
      .user!.related('channels')
      .query()
      // preload messages and get author data
      .preload('messages', (messagesQuery) => {
        messagesQuery.preload('author').orderBy('created_at', 'desc').groupLimit(15)
      })
      .wherePivot('channel_id', params.id)
      .firstOrFail()

    // set channel pivot_invited to false
    await auth.user!.related('channels').detach([channel.id])
    await auth.user!.related('channels').attach({
      [channel.id]: {
        invited: false,
      },
    })
    // get channel messages
    return response.ok(channel)
  }

  public async getMessages({ params, response, auth }: HttpContextContract) {
    const channel = await auth
      .user!.related('channels')
      .query()
      // preload messages and get author data
      .preload('messages', (messagesQuery) => {
        messagesQuery.preload('author').orderBy('created_at', 'desc').groupLimit(params.n)
      })
      .wherePivot('channel_id', params.id)
      .firstOrFail()
    return response.ok(channel.messages)
  }

  public async delete({ params, auth, response }: HttpContextContract) {
    const channel = await Channel.findOrFail(params.id)
    if (channel.ownerId !== auth.user!.id) {
      throw new Error('You are not the owner of this channel')
    }
    await channel.delete()
    return response.ok({ success: true })
  }

  public async join({ auth, request, response }: HttpContextContract) {
    const joinChannelSchema = schema.create({
      channelName: schema.string(),
      isPrivate: schema.boolean(),
    })
    const payload = await request.validate({ schema: joinChannelSchema })
    const channel = await Channel.findBy('name', payload.channelName)
    if (!channel) {
      const channel = await auth.user!.related('channels').create({
        name: payload.channelName,
        isPrivate: payload.isPrivate,
      })

      await channel.related('owner').associate(auth.user!)
      return response.created(channel)
    }
    if (channel.isPrivate) throw new Error('Channel is private')
    /*
    const reports = await channel
      .related('reports')
      .query()
      .wherePivot('reported_user_id', auth.user!.id)
    if (reports.length >= 3) throw new Error('You are banned from this channel')*/

    await auth.user!.related('channels').attach([channel.id])
    return response.ok(channel)
  }

  public async lister({ response, params, auth }: HttpContextContract) {
    //   list users in channel
    const channel = await auth
      .user!.related('channels')
      .query()
      .wherePivot('channel_id', params.id)
      .firstOrFail()
    const users = await channel.related('users').query()
    console.log(users)
    return response.ok(users)
  }

  public async remove({ response, auth, request }: HttpContextContract) {
    const removeChannelSchema = schema.create({
      channelId: schema.number(),
      userName: schema.string(),
    })
    const payload = await request.validate({ schema: removeChannelSchema })
    const channel = await auth
      .user!.related('channels')
      .query()
      .wherePivot('id', payload.channelId)
      .firstOrFail()
    if (channel.ownerId !== auth.user!.id) {
      throw new Error('You are not the owner of this channel')
    }
    const user = await User.findByOrFail('username', payload.userName)
    await user.related('channels').detach([channel.id])
    return response.ok({ success: true })
  }

  public async getUsers({ params, response }: HttpContextContract) {
    const channel = await Channel.findOrFail(params.id)
    const users = await channel.related('users').query()
    return response.ok(users)
  }

  public async kick({ response, auth, request }: HttpContextContract) {
    const removeChannelSchema = schema.create({
      channelId: schema.number(),
      userName: schema.string(),
      // userName: schema.number(),
    })
    const payload = await request.validate({ schema: removeChannelSchema })
    const channel = await auth
      .user!.related('channels')
      .query()
      .wherePivot('channel_id', payload.channelId)
      .firstOrFail()
    const reportedUser = await User.findByOrFail('username', payload.userName)

    console.log('KICK')
    if (channel.isPrivate) {
      console.log('Kanal je private')
      if (auth.user!.id !== channel.ownerId)
        throw new Error('You are not the owner of this channel')
      await reportedUser.related('channels').detach([channel.id])
      return response.ok({ success: true })
    }

    if (channel.ownerId === auth.user!.id) {
      console.log('Kanal je public, si owner')
      await channel
        .related('reports')
        .query()
        .wherePivot('reported_user_id', reportedUser.id)
        .andWherePivot('user_id', auth.user!.id)
        .delete()
      await channel.related('reports').attach({
        [auth.user!.id]: { reported_user_id: reportedUser.id },
      })
      await reportedUser.related('channels').detach([channel.id])
      return response.ok({ success: true })
    }
    console.log('Kanal je public, nie si owner')
    await channel
      .related('reports')
      .query()
      .wherePivot('reported_user_id', reportedUser.id)
      .andWherePivot('user_id', auth.user!.id)
      .delete()
    await channel.related('reports').attach({
      [auth.user!.id]: { reported_user_id: reportedUser.id },
    })
    const reports = await channel
      .related('reports')
      .query()
      .wherePivot('reported_user_id', reportedUser.id)
    console.log(reports.length)

    if (reports.length < 3) return response.ok({ success: true, reports: reports.length })

    await channel.related('users').detach([reportedUser.id])
    if (reportedUser.id === channel.ownerId) {
      await channel.delete()
    }
    return response.ok({ success: true })
  }
}
