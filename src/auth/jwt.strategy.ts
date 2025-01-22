import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '2dd09f7663e4bfad34cbe4a4d0eb00a24725aa516d8a35984c8e634f79e5e92ad442fb0b4beaa5be9de9e0ff29e0f5aec6469640761eb1586c9b0ba98bd4aa93', // A mettre dans un .env, ici c'est un poc nous n'utiliserons pas de .env plus de simplicité
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
