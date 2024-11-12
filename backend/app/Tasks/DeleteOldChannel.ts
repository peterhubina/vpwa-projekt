import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task'
import Channel from 'App/Models/Channel'
import Message from 'App/Models/Message'
import { DateTime } from 'luxon'

export default class DeleteOldChannel extends BaseTask {
  public static get schedule() {
    return CronTimeV2.everySecond()
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    try {
      const channels = await Channel.all()

      for (const channel of channels) {
        const lastMessage = await Message.query()
          .where('channel_id', channel.id)
          .orderBy('created_at', 'desc')
          .first()

        if (lastMessage) {
          const messageDate = DateTime.fromISO(lastMessage.createdAt.toString())
          const currentDate = DateTime.now()

          const daysDifference = currentDate.diff(messageDate, 'days').days

          if (daysDifference > 30) {
            await Channel.query().where('id', channel.id).delete()
            await Message.query().where('channel_id', channel.id).delete()
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`)
    }
  }
}
