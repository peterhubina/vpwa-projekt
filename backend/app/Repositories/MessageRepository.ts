import type {
  MessageRepositoryContract,
  SerializedMessage,
} from '@ioc:Repositories/MessageRepository'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelName: string, auth: HttpContextContract['auth']): Promise<any[]> {
    const channel = await auth
      .user!.related('channels')
      .query()
      .where('name', channelName)
      .preload('messages')
      .firstOrFail()

    return channel.messages.map((message) => message.serialize())
  }

  public async create(
    channelName: string,
    auth: HttpContextContract['auth'],
    content: string
  ): Promise<SerializedMessage> {
    // check if user is in channel
    //console.log('Auth: ', auth)
    //console.log('channelName: ', channelName)
    //console.log('content: ', content)
    const channel = await auth
      .user!.related('channels')
      .query()
      .where('name', channelName)
      .firstOrFail()
    const message = await channel.related('messages').create({ createdBy: auth.user!.id, content })
    await message.load('author')

    return message.serialize() as SerializedMessage
  }
}
