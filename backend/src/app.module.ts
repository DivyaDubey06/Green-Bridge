import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { DatabaseModule } from './common/database/database.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'greenbridge-super-secret-key-12345',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    PrismaModule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
