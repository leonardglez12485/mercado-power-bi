/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User, UserDocument } from '../auth/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectModel(User.name) private readonly userRepository: Model<UserDocument>,
  ){}

 async registerClients(client: Socket, userId: string) {
    const user = await this.userRepository.findById(userId);
    if(!user) throw new NotFoundException('User not found');
    if(!user.isActive) throw new BadRequestException('User is not active'); 
    this.checkUserConnection(user);
    this.connectedClients[client.id] = {
        socket: client,
        user
    };
  }

  removeClients(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnecteClients(): string[] {
    //console.log(this.connectedClients)
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string):string{
    return this.connectedClients[socketId].user.fullName;
}

private checkUserConnection(user: User){
    for(const clientId of Object.keys(this.connectedClients)){
        const connectedClient = this.connectedClients[clientId];
        if(connectedClient.user.email === user.email){
            connectedClient.socket.disconnect();
            break;
    }
        }
    }
}

