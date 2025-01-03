import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AuthReqDto } from './dto/auth.req.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('token')
  getToken(@Body() signInDto: AuthReqDto) {
    return this.authService.getToken(signInDto.username, signInDto.password);
  }
}
