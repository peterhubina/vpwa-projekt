import { User } from 'src/contracts'
import { authManager } from '.'
import { SocketManager } from './SocketManager'
import { useChannelStore } from 'src/stores/channel'
import { ListChannel } from 'src/contracts'
import {Notify, AppVisibility} from 'quasar';
import {useAuthStore} from 'stores/auth';

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

      const channelStore = useChannelStore()
      const authStore = useAuthStore()
      const userStatus = authStore.userStatus;

      console.log(authStore.user)
      if (userStatus === 'online') {
        if (AppVisibility.appVisible) {
          Notify.create({
            message: `#${channel.name} - User has been invited to the channel`,
            color: 'info',
            position: 'top',
            icon: 'chat',
          });
        } else if (Notification.permission === 'granted') {
          const systemNotification = new Notification(`#${channel.name} - User has been invited to the channel`);

          systemNotification.onclick = () => {
            window.focus();
          };
        } else if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
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
