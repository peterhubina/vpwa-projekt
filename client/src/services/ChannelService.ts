import { SocketManager } from './SocketManager'
import {useChannelStore} from 'stores/channel';
import {useRouter} from 'vue-router';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe (): void {
    const channel = this.namespace.split('/').pop() as string
    const channelStore = useChannelStore()
    this.socket.on('message', (message: any) => {
      channelStore.insertNewMessage(message, channel)
    })
    this.socket.on('channelDeleted', (channel: any) => {
      console.log('channel deleted', channel)
      channelStore.removedFromChannel(channel)
    })
    this.socket.on('channelLeft', (channel: any) => {
      console.log('channel left', channel)
      channelStore.userLeftChannel(channel)
    })
    this.socket.on('printTyping', (channel: any, user: any, messagebeingtyped: string) => {
      console.log('print typing', channel, user, messagebeingtyped)
      if (channelStore.currentChannel){
        console.log('current channel', channelStore.currentChannel)
        channelStore.currentChannel.is_typing = []
        // show typing message only if message is not empty
        if(messagebeingtyped != ''){
          channelStore.currentChannel.is_typing?.push({user: user, message:messagebeingtyped})
        }
      }
    })
  }

  public addMessage (message: any): Promise<any> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (): Promise<any[]> {
    return this.emitAsync('loadMessages')
  }

  public deleteChannel (): Promise<any> {
    return this.emitAsync('deleteChannel')
  }

  public leaveChannel (): Promise<any> {
    return this.emitAsync('leaveChannel')
  }

  public printTyping (channel: any, user: any, messagebeingtyped: string): Promise<any> {
    return this.emitAsync('printTyping', channel, user, messagebeingtyped)
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public join (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`)
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`)
    this.channels.set(name, channel)
    return channel
  }

  public leave (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    // disconnect namespace and remove references to socket
    channel.destroy()
    return this.channels.delete(name)
  }

  public delete (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    channel.deleteChannel().then(() => {
      channel.destroy()
    })
    return this.channels.delete(name)
  }

  public leaveChannel (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    channel.leaveChannel().then(() => {
      channel.destroy()
    })
    return this.channels.delete(name)
  }

  public in (name: string): ChannelSocketManager | undefined {
    return this.channels.get(name)
  }
}

export default new ChannelService()
