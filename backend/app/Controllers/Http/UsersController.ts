import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import  User  from 'App/Models/User'
import Database from "@ioc:Adonis/Lucid/Database";

export default class UsersControllers {
  public async status({ request, response }: HttpContextContract) {
    const { status, userId } = request.all()
    const user = await User.findOrFail(userId)
    user.status = status
    await user.save()
    //console.log('Changed user: ', user)
    return response.ok({ success: true })
  }

  public async getStatus({ params, response }: HttpContextContract) {
    try {
      const userId = params.userId;
      const user = await User.findOrFail(userId);

      return response.ok({
        success: true,
        status: user.status,
      });
    } catch (error) {
      console.error('Error fetching user status:', error);
      return response.status(400).send({
        success: false,
        message: 'Unable to fetch user status',
      });
    }
  }

  public async getKickVotes({ params, response }: HttpContextContract) {
    console.log('Som tu')
    try {
      const channelId = params.channelId
      const kickVotes = await Database
        .from('channel_reports')
        .select('reported_user_id')
        .count('* as votes')
        .where('channel_id', channelId)
        .groupBy('reported_user_id')

      console.log('Kick votes: ', kickVotes)

      return response.ok(kickVotes)
    } catch (error) {
      console.error('Error fetching kick votes:', error)
      return response.status(400).send({
        success: false,
        message: 'Unable to fetch kick votes',
      })
    }
  }
}
