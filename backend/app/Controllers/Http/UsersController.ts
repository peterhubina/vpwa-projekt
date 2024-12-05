import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import  User  from 'App/Models/User'

export default class UsersControllers {
  public async status({ request, response }: HttpContextContract) {
    const { status, userId } = request.all()
    const user = await User.findOrFail(userId)
    console.log(user)
    console.log(status)
    user.status = status
    await user.save()
    console.log('Changed user: ', user)
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
}
