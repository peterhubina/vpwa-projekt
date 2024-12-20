import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";
import Channel from "App/Models/Channel";
import Notification from 'App/Models/Notification'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public createdBy: number;

  @column()
  public channelId: number;

  @column()
  public content: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: "createdBy",
  })
  public author: BelongsTo<typeof User>;

  @belongsTo(() => Channel, {
    foreignKey: "channelId",
  })
  public channel: BelongsTo<typeof Channel>;

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>
}
