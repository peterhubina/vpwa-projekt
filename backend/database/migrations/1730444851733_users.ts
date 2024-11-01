import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('name').notNullable()
      table.string('surname').notNullable()
      table.string('username').notNullable().unique()
      table.string('remember_me_token').nullable()

      table.enu('role', ['user', 'admin']).notNullable().defaultTo('user')
      table.enu('status', ['online', 'dnd', 'offline']).notNullable().defaultTo('offline')

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
