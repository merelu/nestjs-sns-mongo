import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';
import { HttpStrategy } from '../strategies/http.strategy';
import { UserModel } from '@domain/model/database/user';

export interface AuthenticatedSocket extends Socket {
  data: UserModel;
}

export class RedisIoAdapter extends IoAdapter {
  private httpStrategy: HttpStrategy;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.httpStrategy = this.app.get(HttpStrategy);
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://localhost:6379` });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    server.adapter(this.adapterConstructor);
    server.use(async (socket: AuthenticatedSocket, next: any) => {
      try {
        const token =
          socket.handshake.headers.authorization?.split(' ')[1] ||
          socket.handshake.headers.cookie?.split(';')[0].split('=')[1];

        if (!token) {
          throw new UnauthorizedException('Unauthorized');
        }

        const user = await this.httpStrategy.validate(token);
        if (!user) {
          throw new UnauthorizedException('Unauthorized');
        }
        socket.data = user;
        return next();
      } catch (err) {
        return next(new UnauthorizedException('Unauthorized'));
      }
    });
    return server;
  }
}
