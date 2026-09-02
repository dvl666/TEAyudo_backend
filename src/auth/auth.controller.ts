import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/user/dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/test')
  @UseGuards( AuthGuard() )
  test(
    @GetUser() user: any,
    @RawHeaders() rawHeaders: string[]
  ) {
    console.log(user);

    return { 
        user, 
        rawHeaders
     };
  }

  
  @Get('/test2')
  @UseGuards( AuthGuard() )
  test2(
    @GetUser() user: any,
  ) {
    return {
      user
    }
  }

}
