export class CreateChannelDto {
  serverId: number;
  name: string;
  type: 'text' | 'voice';
}
