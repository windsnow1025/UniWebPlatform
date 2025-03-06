import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import {
  TokenEmailReqDto,
  TokenUsernameReqDto,
} from './dto/auth.token.req.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('token/email')
  createTokenByEmail(@Body() tokenReqDto: TokenEmailReqDto) {
    return this.authService.getTokenByEmail(
      tokenReqDto.email,
      tokenReqDto.password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('token/username')
  createTokenByUsername(@Body() tokenReqDto: TokenUsernameReqDto) {
    return this.authService.getTokenByUsername(
      tokenReqDto.username,
      tokenReqDto.password,
    );
  }
}
