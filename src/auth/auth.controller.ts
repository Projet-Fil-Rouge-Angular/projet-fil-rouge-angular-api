import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(
      await this.authService.validateUser(loginDto.username, loginDto.password),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('validate-token')
  validateToken(@Request() req: any) {
    return {
      valid: true,
      user: req.user,
    };
  }
}
