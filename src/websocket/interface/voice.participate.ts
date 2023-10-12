export interface VoiceParticipate {
  [key: string]: ParticipateInfomation;
};

interface ParticipateInfomation {
  serverId: string;
  channelId: string;
};