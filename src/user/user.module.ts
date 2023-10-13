import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/passport.jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: {
          expiresIn: '300s',
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
  ],
})
export class UserModule { }


// {
//   // secret: 'secret key for test',
//   secret: process.env.SECRET_KEY || 'secret key for test',
//   signOptions: { expiresIn: '300s' },
// }

// TypeOrmModule.forRootAsync({
//   imports: [ConfigModule],
//   useClass: TypeOrmConfigService,
// }),