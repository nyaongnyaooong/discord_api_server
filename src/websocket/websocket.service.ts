import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { ChatDto } from './dto/chat.dto';
import { Repository } from 'typeorm';
import { ChatSocketDto } from './dto/chat.socket.dto';
import { Server, Socket } from 'socket.io';
import { UserDataDto } from 'src/user/dto/user.data.dto';
import { JoinVoiceDto } from './dto/join.voice.dto';
import { serverMemberDto } from './dto/server.member.dto';
import { VoiceParticipate } from './interface/voice.participate';
import { VoiceServer } from './interface/voice.server';


@Injectable()
export class WebsocketService {

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {
  }

  // 클라이언트의 유저 정보 / 접속중인 유저의 클라이언트 정보
  clientInfo = {};
  userInfo = {};

  // 특정 룸에 접속한 유저들
  roomMember: { [key: string]: string[] } = {};

  // 보이스 채널 참가자 목록 / 유저가 참가한 보이스 채널
  voiceServers: VoiceServer = {};
  voiceParticipate: VoiceParticipate = {};

  // peerConnections = {};



  // 클라이언트 소켓 접속 시 유저 데이터를 매칭
  setUserInfo = (userDataDto: UserDataDto, client: Socket) => {
    console.log(`유저 정보 배열 추가 - ID : ${client.id}`)
    this.userInfo[userDataDto.id] = client.id;
    this.clientInfo[client.id] = userDataDto;

    client.broadcast.emit('online', this.clientInfo[client.id].id)
  }

  // 클라이언트 접속종료시 유저 데이터 삭제
  deleteUserInfo = (server: Server, client: Socket) => {
    // 모든 보이스 채널 퇴장
    this.leaveVoice(server, client);

    let serverId: string | null;
    console.log('keys',Object.keys(client.rooms))
    client.rooms.forEach(room => { 
      console.log('room?', room)
      if (room !== client.id) serverId = room 
    })
    console.log('cr?', client.rooms)
    console.log('serverId?', serverId)
    // 서버 클라이언트들에게 오프라인임을 알림
    client.broadcast.to(serverId).emit('offline', this.clientInfo[client.id].id)

    // 유저 정보 삭제
    console.log(`유저 정보 삭제 - ID : ${client.id}`)
    const userId = this.clientInfo[client.id].id;
    delete this.userInfo[userId];
    delete this.clientInfo[client.id];
  }

  // 현재 서버에 접속한 유저의 목록 
  reqLoginMember = (client: Socket, serverMembers: serverMemberDto[]) => {
    const onlineUsers = serverMembers.filter(member => this.userInfo[member.user_Id])

    return client.emit('onlineUsers', { serverMembers, onlineUsers });
  }

  // 채널 채팅 기록
  findChat = async (channelId: number) => {
    // 채팅 table + 유저 table 조인
    return await this.chatRepository.find({ where: { channel_id: channelId }, relations: { user: true, } })
  }

  // 룸 입장
  joinServer = async (server: Server, serverId: string, client: Socket) => {
    // 기존에 접속한 룸에서 leave
    client.rooms.forEach(e => {
      if (e !== client.id) client.leave(e);
    })

    // 요청 서버에 입장
    client.join(serverId);
    // 해당 서버 음성 채널 현황 전달
    client.emit('updateVoiceMember', this.voiceServers[serverId])
  }

  // 채팅 history
  sendChatHistory = async (channelId: number, client: Socket) => {
    // 채팅 history를 db에서 불러옴
    const chatListData = await this.findChat(channelId);

    // 채팅 history 전송
    return client.emit('chatHistory', chatListData)
  }

  // 채팅 추가
  createChat = async (server: Server, server_id: number, chatDto: ChatDto) => {
    chatDto.type = chatDto.type || 'text';
    const newChat = await this.chatRepository.save(chatDto);
    const newChatWithUser = await this.chatRepository.findOne({ where: { id: newChat.id }, relations: { user: true, } })
    const room = server_id.toString();

    const response = {
      channelId: chatDto.channel_id,
      message: newChatWithUser
    }

    return server.to(room).emit('newChat', response);
    // return this.broadcastChannel(server, room, 'newChat', newChatWithUser)
    // return server.to(socketData.channel_id.toString()).emit('newChat', newChat);
  }

  // 보이스 채널에 참여한 인원 리스트
  reqJoinerList = (channelId: string, client: Socket) => {
    const roomId = 'v' + channelId;

    return client.emit('joinerList', this.roomMember[roomId]);
  }

  // 보이스 채널 입장
  joinVoice = (joinVoiceDto: JoinVoiceDto, client: Socket, server: Server) => {
    const { serverId, channelId } = joinVoiceDto;

    // // 기존에 접속한 보이스 채널이 있다면 leave
    this.leaveVoice(server, client);

    // 요청 채널 입장
    if (!this.voiceServers[serverId]) this.voiceServers[serverId] = {};
    if (!this.voiceServers[serverId][channelId]) this.voiceServers[serverId][channelId] = {};
    this.voiceServers[serverId][channelId][client.id] = this.clientInfo[client.id];
    this.voiceParticipate[client.id] = { serverId, channelId }

    server.to(serverId).emit('updateVoiceMember', this.voiceServers[serverId])
    client.emit('voiceMembers', this.voiceServers[serverId][channelId])

    // // 룸에 클라이언트 정보 저장
    // if (!this.roomMember[roomId]) this.roomMember[roomId] = [];
    // this.roomMember[roomId].push(client.id);

    // // 입장한 룸의 클라이언트 리스트 전달
    // return client.emit('roomMember', this.roomMember[roomId]);
  }


  // reqExit = (client: Socket) => {
  //   const roomId = this.userJoinedVoiceRoom[client.id];

  //   client.broadcast.to(roomId).emit('clientExit', client.id);
  //   client.leave(roomId);

  //   delete this.userJoinedVoiceRoom[client.id]
  //   if (this.roomMember[roomId]) {
  //     this.roomMember[roomId] = this.roomMember[roomId].filter((id: string) => id !== client.id);
  //     if (this.roomMember[roomId].length === 0) delete this.roomMember[roomId];
  //   }
  // }

  // 보이스 채널 퇴장
  leaveVoice = (server: Server, client: Socket) => {
    // 접속한 보이스 채널이 없으면 종료
    if (!this.voiceParticipate[client.id]) return;

    // 보이스 채널의 서버와 채널 가져옴
    const { serverId, channelId } = this.voiceParticipate[client.id];

    // 해당 voice 채널에서 유저를 지움
    delete this.voiceServers[serverId][channelId][client.id]
    if (Object.keys(this.voiceServers[serverId][channelId]).length === 0) delete this.voiceServers[serverId][channelId];
    if (Object.keys(this.voiceServers[serverId]).length === 0) delete this.voiceServers[serverId];

    // 유저의 접속 중인 voice 채널을 지움
    delete this.voiceParticipate[client.id];

    // 해당 server 클라이언트들에게 업데이트된 정보 배포
    server.to(serverId).emit('updateVoiceMember', this.voiceServers[serverId])
  }

  // 보이스 채널에 들어온 임이의 클라이언트의 정보가 변화했을 때(채널에 입장, 퇴장 등)
  // 해당 서버의 모든 클라이언트에게 해당 정보를 업데이트함
  updateVoiceMember = (serverId: string, server: Server) => {
    // 해당 서버에 접속한 모든 클라이언트들
    const serverClients = this.roomMember[serverId];

    server.to(serverId).emit('asd')

  }



  dm = () => {

  }

}
