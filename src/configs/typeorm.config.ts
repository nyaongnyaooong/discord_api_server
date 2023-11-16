import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Chat } from "src/entities/chat.entity";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private configService: ConfigService
  ) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<any>('TYPEORM_TYPE'),
      host: this.configService.get<string>('TYPEORM_HOST'),
      port: this.configService.get<number>('TYPEORM_PORT'),
      username: this.configService.get<string>('TYPEORM_USER'),
      password: this.configService.get<string>('TYPEORM_PASSWORD'),
      database: this.configService.get<string>('TYPEORM_DB'),
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      // logging: true,
      synchronize: true
    };
  }
  // const a = new Chat
}




// export const typeORMConfig: TypeOrmModuleOptions = {
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'nya',
//   password: '1458369',
//   database: 'discord',
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   synchronize: true
// }