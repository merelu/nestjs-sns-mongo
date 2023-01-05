import { IBcryptService } from '@domain/adapters/bcrypt.interface';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements IBcryptService {
  seed = 10;

  async hash(hashString: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.seed);
    return await bcrypt.hash(hashString, salt);
  }

  async compare(target: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(target, hashed);
  }
}
