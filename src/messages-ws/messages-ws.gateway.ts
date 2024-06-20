import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtPayloadInterface } from '../auth/interfaces';


@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
    ) {}
  
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload:JwtPayloadInterface;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClients(client, payload._id);
    } catch (error) {
      client.disconnect();
      return;
    }

    
    this.wss.emit('clients-updated', this.messagesWsService.getConnecteClients())
  }
 
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClients(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnecteClients())
  }

  @SubscribeMessage('mess-front-client')
  onMessageFromClients(client: Socket, payload: NewMessageDto){

    // //Emite el msg solo a un cliente q lo envia
    // client.emit('mess-front-server', {
    //   fullName: 'Username',
    //   message: payload.message || 'No Message!!!'
    // })

    // //Emite el msg a todos menos al cliente q lo envia
    // client.broadcast.emit('mess-front-server', {
    //   fullName: 'Leo',
    //   message: payload.message || 'No Message!!!'
    // })

    //Emite el msg a todos los usuarios
    this.wss.emit('mess-front-server', 
      {
        fullName: this.messagesWsService.getUserFullName(client.id),
        message: payload.message || 'No Message!!!'
      })
  
  }
}
