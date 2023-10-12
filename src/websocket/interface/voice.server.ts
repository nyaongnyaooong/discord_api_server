import { UserDataDto } from "src/user/dto/user.data.dto"

export interface VoiceServer {
  [key: ServerId]: VoiceChannel
}

interface VoiceChannel {
  [key: ChannelId]: Participant
}

interface Participant {
  [key: ClientId]: UserDataDto
}

type ServerId = string;
type ChannelId = string;
type ClientId = string;

/*
  VoiceServer = {
    server1: {
      channel1: {
        user1
        user2
        ...
      },
      channel2: {
        user3
        user4
        ...
      }
    },
    server2: {
    channel1: {
        user1
        ...
      }
    },
  }
*/