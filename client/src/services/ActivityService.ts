import { User } from 'src/contracts'
import { authManager } from '.'
import { SocketManager } from './SocketManager'
import { useChannelStore } from 'src/stores/channel'
import { ListChannel } from 'src/contracts'

class ActivitySocketManager extends SocketManager {
  public subscribe (): void {
    this.socket.on('user:list', (onlineUsers: User[]) => {
      console.log('Online users list', onlineUsers)
    })

    this.socket.on('user:online', (user: User) => {
      console.log('User is online', user)
    })

    this.socket.on('user:offline', (user: User) => {
      console.log('User is offline', user)
    })

    this.socket.on('user:invite', (user: User, channel: ListChannel) => {
      useChannelStore().channels.push(channel)
    })

    this.socket.on('user:kicked', (channel: ListChannel, userName: string) => {
      useChannelStore().channels = useChannelStore().channels.filter((c) => c.id !== channel.id)

    })

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect()
      } else {
        this.socket.disconnect()
      }
    })
  }

  public offline (user: User): void {
    this.socket.emit('user:offline', user)
  }

  public online (user: User): void {
    this.socket.emit('user:online', user)
  }

  public inviteUser (userName: string, channelId: number): Promise<any> {
    return this.emitAsync('inviteUser', userName, channelId)
  }

  public removeUser (channel: ListChannel, userName: string): Promise<any> {
    return this.emitAsync('kickUser', channel, userName)
  }
}

export default new ActivitySocketManager('/')
