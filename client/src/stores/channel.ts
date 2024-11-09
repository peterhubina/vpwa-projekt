import { defineStore } from 'pinia';
import {computed, ref, watch} from 'vue';
import {ListChannel, Message, UserStatus} from 'stores/models';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import {channelService} from 'src/services';
import authService from 'src/services/AuthService';
import { activityService } from 'src/services';
import { useAuthStore } from './auth';


export const useChannelStore = defineStore('channel', () => {
  const channels = ref<ListChannel[]>([]);
  const route = useRoute();
  const router = useRouter();
  const messages = ref<Record<string, Message[]>>({});
  const loading = ref<boolean>(false)
  const error = ref<Error|null>(null)
  const active = ref<string|null>(null)


  const currentChannel = ref<ListChannel|null>(null)
  const fetchChannels = async () => {
    const { data: channelsData } = await api.get(
      'http://localhost:3333/channels'
    );
    channels.value = channelsData;
    channels.value.sort((a, b) => {
      if (a.pivot_invited && !b.pivot_invited) {
        return -1;
      } else if (!a.pivot_invited && b.pivot_invited) {
        return 1;
      } else {
        return 0;
      }
    })

    channels.value.forEach((channel) => {
      channelService.join(channel.name).loadMessages()
    })

  };

  const joinChannel = async (channelName: string, isPrivate: boolean) => {
    const { data: channel } = await api.post<ListChannel>(
      'http://localhost:3333/channels/join',
      { channelName, isPrivate }
    );
    await channelService.join(channelName).loadMessages();

    channels.value.push(channel);
    router.push(`/channels/${channel.id}`);
  };

  const removeChannel = async (channel: ListChannel) => {
    channelService.delete(channel.name)
    channels.value = channels.value.filter((c) => c.id !== channel.id);
    await router.push('/channels');
  };

  const leaveChannel = async (channel: ListChannel) => {
    console.log('LEAVE');
    channelService.leaveChannel(channel.name)
    channels.value = channels.value.filter((c) => c.id !== channel.id);
    await router.push('/channels');
  };

  const sendMessage = async (channel: ListChannel, message: string) => {
    const newMessage = await channelService.in(channel.name)?.addMessage(message)

    console.log(newMessage, 'SUCC')
    insertNewMessage(newMessage, channel.name)
  };

  const getMessages = async (channel: ListChannel, count: number) => {
    const { data: messages } = await api.get<Message[]>(`http://localhost:3333/channels/${channel.id}/${count}`);

    insertNewMessage(messages, channel.name)
    return messages;
  };

  const inviteUser = async (channel: ListChannel, user: string) => {
    console.log('INVITE');
    /*
    const { data: success } = await api.post<{success: true}>(
      'http://localhost:3333/channels/invite',
      {
        channelId: channel.id,
        userName: user,
      }
    );*/

    activityService.inviteUser(user, channel.id)
  };

  const removeUser = async (channel: ListChannel, user: string) => {
    /*
    const { data: success } = await api.post<any>(
      'http://localhost:3333/channels/kick',
      {
        channelId: channel.id,
        userName: user,
      }
    );
    */
    activityService.removeUser(channel, user)
  };

  watch(() => route?.params.id, () => {
      api.get<ListChannel & {messages: Message[]}>(`http://localhost:3333/channels/${route.params.id}`).then((res) => {
        currentChannel.value = res.data
        insertNewMessage(res.data.messages, res.data.name)
      })
    }
  );

  const currentMessages = computed(() => {
    return messages.value[currentChannel.value?.name ?? '']
  })

  const insertNewMessage = (message: Message|Message[], channel: string) => {
    if(!messages.value[channel]) {
      messages.value[channel] = [];
    }
    if(Array.isArray(message)) {
      messages.value[channel] = message;
    } else {
      messages.value[channel].unshift(message);
    }
  }

  const removedFromChannel = (channel: ListChannel) => {
    channels.value = channels.value.filter((c) => c.id !== channel.id);
    router.push('/channels');
  }

  const userLeftChannel = (channel: ListChannel) => {
    const index = channels.value.findIndex((c) => c.id === channel.id)
    channels.value[index] = channel
  }

  const LOADING_START: any = () => {
    loading.value = true
    error.value = null
  };
  const LOADING_SUCCESS = ({ channel, messages2 }: { channel: string, messages2: Message[] }) => {
    loading.value = false
    messages.value[channel] = messages2
  };
  const LOADING_ERROR = (error: { value: any; }) => {
    loading.value = false
    error.value = error
  };
  const CLEAR_CHANNEL = (channel: string | number) => {
    active.value = null
    delete messages.value[channel]
  };
  const SET_ACTIVE = (channel: string) => {
    active.value = channel
  };
  const NEW_MESSAGE = ({ channel, message }: { channel: string, message: Message }) => {
    messages.value[channel].push(message)
  }

  const join = async (channel: string) => {
    try {
      LOADING_START();
      const messages = await channelService.join(channel).loadMessages();
      LOADING_SUCCESS ({channel, messages2:messages });
    } catch (err) {
      LOADING_ERROR({value:err});
      throw err;
    }
  };

  const leave = async (channel: string | null) => {
    const leaving: string[] = channel !== null ? [channel] : joinedChannels();

    leaving.forEach((c: string) => {
      channelService.leave(c);
      CLEAR_CHANNEL(c);
    });
  };

  const addMessage = async ({ channel, message }: { channel: string, message: any }) => {
    const newMessage = await channelService.in(channel)?.addMessage(message);
    NEW_MESSAGE({ channel, message: newMessage });
  };


  const joinedChannels = () => {
    return Object.keys(messages.value);
  };


  const lastMessageOf = () => {
    return (channel: string) => {
      const channelMessages = messages.value[channel];
      return channelMessages.length > 0 ? channelMessages[channelMessages.length - 1] : null;
    };
  };
/*
  const userIsTyping = (messagebeingtyped: string) => {
    const channel =  currentChannel.value?.name ?? ''
    if (!channel) return

    const channelServiceInstance = channelService.in(channel);
    if (channelServiceInstance) {
      channelServiceInstance.printTyping(currentChannel.value, useAuthStore().user, messagebeingtyped);
    }
  };*/

  return {
    channels,
    fetchChannels,
    joinChannel,
    removeChannel,
    leaveChannel,
    currentChannel,
    sendMessage,
    inviteUser,
    removeUser,
    getMessages,
    insertNewMessage,
    currentMessages,
    messages,
    removedFromChannel,
    userLeftChannel,
    LOADING_START,
    LOADING_SUCCESS,
    LOADING_ERROR,
    CLEAR_CHANNEL,
    SET_ACTIVE,
    NEW_MESSAGE,
    join,
    leave,
    addMessage,
    joinedChannels,
    lastMessageOf,
    //userIsTyping
  };
});
