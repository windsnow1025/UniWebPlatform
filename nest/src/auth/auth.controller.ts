import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AuthTokenReqDto } from './dto/auth.token.req.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('token')
  getToken(@Body() tokenReqDto: AuthTokenReqDto) {
    return this.authService.getToken(tokenReqDto.email, tokenReqDto.password);
  }
}
