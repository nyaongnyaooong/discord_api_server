import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, GatewayMetadata } from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import { ChatSocketDto } from './dto/chat.socket.dto';
import { UserDataDto } from 'src/user/dto/user.data.dto';
import { JoinVoiceDto } from './dto/join.voice.dto';
import { AnswerSocketDto } from './dto/answer.socket.dto';
import { CandidateSocketDto } from './dto/candidate.socket.dto';
import { OfferSocketDto } from './dto/offer.socket.dto';
import { serverMemberDto } from './dto/server.member.dto';

const websocketOption: GatewayMetadata = {
  cors: {
    origin: [process.env.STATIC_SERVER_URL, 'http://220.120.197.83:3000'],
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  }
}

@WebSocketGateway(+process.env.STATIC_SERVER_URL || 3030, websocketOption)
export class WebsocketGateway {
  constructor(
    private readonly websocketService: WebsocketService,
  ) { }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // 클라이언트와 연결되었을 때 실행할 코드
    console.log(`Socket 접속 - ID : ${client.id}`)

    client.on('disconnecting', (reason) => {
      console.log(`클라이언트 로그아웃 - ID : ${client.id}`)
      return this.websocketService.deleteUserInfo(this.server, client);
    });
  }



  // async handleDisconnection(client: Socket) {
  //   console.log(`클라이언트 로그아웃 - ID : ${client.id}`)
  //   // 클라이언트가 연결을 끊었을 때 실행할 코드
  //   return this.websocketService.deleteUserInfo(client);
  // }

  // 클라이언트 정보 등록
  @SubscribeMessage('userInfo')
  setUserInfo(
    @MessageBody() userDataDto: UserDataDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.websocketService.setUserInfo(userDataDto, client);
  }

  // 클라이언트 list 중 온라인 중인 클라이언트 return
  @SubscribeMessage('reqLoginMember')
  async reqLoginMember(
    @MessageBody() serverMembers: serverMemberDto[],
    @ConnectedSocket() client: Socket,
  ) {
    return this.websocketService.reqLoginMember(client, serverMembers);
  }

  // 채팅 채널 입장
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() serverId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.websocketService.joinServer(this.server, serverId, client)
  }

  // 채널 채팅 전송 요청
  @SubscribeMessage('sendChat')
  async createChat(
    @MessageBody() chatSocketDto: ChatSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { server_id, ...chatDto } = chatSocketDto

    console.log(client.rooms)
    console.log(server_id)
    return await this.websocketService.createChat(this.server, server_id, chatDto)
  }

  // 채널 채팅 history 전송 요청
  @SubscribeMessage('reqChatHistory')
  async sendChatHistory(
    @MessageBody() channelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.websocketService.sendChatHistory(+channelId, client)
  }


  // 보이스 참여 현황 정보 요청
  @SubscribeMessage('reqJoinerList')
  async reqJoinerList(
    @MessageBody() channelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.websocketService.reqJoinerList(channelId, client)
  }

  // 보이스 채널 입장
  @SubscribeMessage('joinVoice')
  async joinVoice(
    @MessageBody() joinVoiceDto: JoinVoiceDto,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.websocketService.joinVoice(joinVoiceDto, client, this.server)
  }

  // 보이스 채널 퇴장
  @SubscribeMessage('leaveVoice')
  leaveVoice(
    @ConnectedSocket() client: Socket,
  ) {
    return this.websocketService.leaveVoice(this.server, client)
  }

  // 'offer' 이벤트를 수신하면 offer를 receiver에서 전송함
  @SubscribeMessage('offer')
  async offer(
    @MessageBody() offerSocketDto: OfferSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { receiver, offer } = offerSocketDto;
    const sender = client.id;

    client.to(receiver).emit('offer', { sender, offer })
  }

  // 'answer' 이벤트를 수신하면 answer를 보낸 클라이언트에게 'answer' 이벤트를 전송합니다.
  @SubscribeMessage('answer')
  async answer(
    @MessageBody() answerSocketDto: AnswerSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { receiver, answer } = answerSocketDto;
    const sender = client.id;

    return client.to(receiver).emit('answer', { sender, answer })
    // return this.websocketService.answer(data, client)
  }

  // 'candidate' 이벤트를 수신하면 candidate를 보낸 클라이언트에게 'candidate' 이벤트를 전송합니다.
  @SubscribeMessage('candidate')
  async candidate(
    @MessageBody() candidateSocketDto: CandidateSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { receiver, candidate } = candidateSocketDto;
    const sender = client.id;

    return client.to(receiver).emit('candidate', { sender, candidate });
  }

  // 'disconnect' 이벤트를 수신하면
  @SubscribeMessage('reqExit')
  async reqExit(
    @ConnectedSocket() client: Socket,
  ) {
    console.log('is reqExit alive?')
    // return this.websocketService.reqExit(client)
    // return client.to(clientId).emit('candidate', { clientId: client.id, candidate: rtcIceCandidate });
  }






  @SubscribeMessage('dm')
  asdv() {
    this.websocketService.dm();
    // return this.server.emit('ServerToClient', 'dmdmdmdm');
  }

}
