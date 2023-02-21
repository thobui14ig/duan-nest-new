import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  @WebSocketServer() server: Server;
  // private logger: Logger = new Logger('MessageGateway');

  afterInit(server: Server) {
    console.log('Socket.IO server initialized');
  }

  async handleConnection(client: Socket) {
    const user = await this.getDataUserFromToken(client);
    console.log(111, user);
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  async getDataUserFromToken(client: Socket): Promise<any> {
    const authToken: any = client.handshake?.query?.token;
    try {
      const decoded = this.jwtService.verify(authToken);

      return await this.userService.findByName(decoded.name); // response to function
    } catch (ex) {
      console.log(222);
      // throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
