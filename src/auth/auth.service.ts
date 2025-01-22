import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly usersFilePath = path.join(__dirname, '../../users.json');

  constructor(private readonly jwtService: JwtService) {}

  private loadUsers(): User[] {
    const data = fs.readFileSync(this.usersFilePath, 'utf8');
    return JSON.parse(data);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const users = this.loadUsers();
    const user = users.find((u) => u.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid username or password');
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
