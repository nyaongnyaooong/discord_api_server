import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

// export const JwtConfig: JwtModuleOptions = {
//   // secret: 'secret key for test',
//   secret: process.env.SECRET_KEY || 'secret key for test',
//   signOptions: { expiresIn: '300s' },
// }

export class JwtConfig implements JwtOptionsFactory {
  constructor(
    private configService: ConfigService,
  ) { }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get('SECRET_KEY'),
      signOptions: { expiresIn: '300s' },
    }
  }
  // useFactory: async (configService: ConfigService) => ({
  //   secret: configService.get('SECRET_KEY'),
  //   signOptions: { expiresIn: '300s' },
  // }),
}