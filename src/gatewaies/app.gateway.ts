import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from './../users/users.service';

@WebSocketGateway({
  cors: true,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  public listUser = [];
  constructor(
    private jwtService: JwtService,
    private userService: UsersService, // private listUser: { id: string; token: string }[],
  ) {}

  @WebSocketServer() server: Server;
  // private logger: Logger = new Logger('MessageGateway');

  afterInit(server: Server) {
    console.log('Socket.IO server initialized');
  }

  async handleConnection(client: Socket) {
    const user = await this.getDataUserFromToken(client);
    if (user) {
      this.addUser({ id: user._id, socketId: client.id });
    }
  }

  @SubscribeMessage('sendMessage')
  messages(
    client: Socket,
    payload: { senderId: string; text: string; receiveId: string },
  ) {
    const { senderId, receiveId, text } = payload;
    const userReceive = this.getUser(receiveId);
    const emit = this.server;

    emit.emit('sendDataServer', {
      render: true,
    });
  }

  handleDisconnect(client: Socket) {
    this.removeUser(client.id);
  }

  addUser(user: { id: string; socketId: string }) {
    const { id, socketId } = user;
    !this.listUser.some((user) => user.id.toString() === id.toString()) &&
      this.listUser.push({ id: id.toString(), socketId });
  }

  removeUser(socketId: string) {
    this.listUser = this.listUser.filter((user) => user.socketId !== socketId);
  }

  getUser(userId: string) {
    const data = this.listUser.find((user) => {
      user.id.toString() === userId;
    });
    return data;
  }

  async getDataUserFromToken(client: Socket): Promise<any> {
    const authToken: any = client.handshake?.query?.token;
    try {
      const decoded = this.jwtService.verify(authToken);

      return await this.userService.findByName(decoded.name); // response to function
    } catch (ex) {
      // throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
