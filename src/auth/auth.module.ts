import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: '2dd09f7663e4bfad34cbe4a4d0eb00a24725aa516d8a35984c8e634f79e5e92ad442fb0b4beaa5be9de9e0ff29e0f5aec6469640761eb1586c9b0ba98bd4aa93', // A mettre dans un .env, ici c'est un poc nous n'utiliserons pas de .env plus de simplicité
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
