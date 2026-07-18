import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { DatabaseModule } from './common/database/database.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'greenbridge-super-secret-key-12345', // Simple secure-ready token signature secret
      signOptions: { expiresIn: '7d' },
    }),
    PrismaModule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
