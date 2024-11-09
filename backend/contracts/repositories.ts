// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
declare module '@ioc:Repositories/MessageRepository' {
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

  export interface SerializedMessage {
    createdBy: number
    content: string
    channelId: number
    createdAt: string
    updatedAt: string
    id: number
    author: {
      id: number
      email: string
      createdAt: string
      updatedAt: string
    }
  }

  export interface MessageRepositoryContract {
    getAll(channelName: string, auth: HttpContextContract['auth']): Promise<SerializedMessage[]>
    create(
      channelName: string,
      auth: HttpContextContract['auth'],
      content: string
    ): Promise<SerializedMessage>
  }

  const MessageRepository: MessageRepositoryContract
  export default MessageRepository
}
