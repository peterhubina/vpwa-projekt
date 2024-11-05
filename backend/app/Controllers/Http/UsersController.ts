import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import  User  from 'App/Models/User'

export default class UsersControllers {
  public async status({ request, response }: HttpContextContract) {
    const { status, userId } = request.all()
    const user = await User.findOrFail(userId)
    console.log(user)
    console.log(status)
    //user.state = status
    await user.save()
    return response.ok({ success: true })
  }
}
