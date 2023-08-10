import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SignInAuthDto } from './dto/signin-auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
        private prismaService: PrismaService,
        private jwtService: JwtService){}
  
  async signUp(signUpDto: SignUpAuthDto) {
    let existUser = await this.userService.findEmail(signUpDto.email)
    if(existUser) throw new ForbiddenException("User already exists.")
    const user = await this.createUser(signUpDto)

    const payload = { sub: user.id, email: user.email, fullname: `${user.first_name} ${user.last_name}` };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

   async signIn(signInDto:SignInAuthDto) {
    const user = await this.userService.findEmail(signInDto.email);
    if(!user) throw new ForbiddenException("User doesn't exist.")
    let hashedPassword = await argon.verify(user?.password, signInDto.password)
    if (!hashedPassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email, fullname: `${user.first_name} ${user.last_name}` };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async createUser(signUpDto: SignUpAuthDto) {
            return await this.prismaService.user.create({
            data: {
                email: signUpDto.email,
                first_name: signUpDto.first_name,
                last_name: signUpDto.last_name,
                password: await argon.hash(signUpDto.password)
            },
            select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true
            }
        });
  }
}
