import {defineStore} from 'pinia';
import {/*computed,*/ ref} from 'vue';
//import {channelService} from 'src/services';
//import {useRoute, useRouter} from 'vue-router';
import {Message, ListChannel} from 'stores/models';

import { SerializedMessage } from 'src/contracts';

export interface ChannelsStateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  active: string | null;
}

export const useChannelStore = defineStore('channel', () => {
  const channels = ref<ListChannel[]>([]);
  //const route = useRoute();
  //const router = useRouter();
  const messages = ref<Record<string, Message[]>>({});
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)
  const active = ref<string | null>(null)
  /*
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
  };*/

  /*const SET_ACTIVE = (channel: string) => {
    active.value = channel
  };*/

  /*const NEW_MESSAGE = ({ channel, message }: { channel: string, message: Message }) => {
    messages.value[channel].push(message)
  }*/
  /*
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

  const currentMessages = computed(() => {
    return messages.value[currentChannel.value?.name ?? '']
  })*/

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

  return {
    channels,
    messages,
    loading,
    error,
    active,
    insertNewMessage/*
    currentChannel,
    fetchChannels,
    joinChannel,
    removeChannel,
    leaveChannel,
    sendMessage*/
  };
});
