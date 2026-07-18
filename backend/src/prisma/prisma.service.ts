import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly isMockMode: boolean;

  constructor(private readonly config: ConfigService) {
    const isMock = config.get('USE_MOCK_DATABASE') !== 'false';
    
    // In Prisma 7, the constructor requires options (e.g. accelerateUrl or adapter).
    // If we are in mock mode, we pass a dummy string so it doesn't crash on instantiation.
    // If we are not in mock mode, we pass the real DATABASE_URL.
    const databaseUrl = isMock 
      ? 'mongodb://localhost:27017/dummy' 
      : config.get('DATABASE_URL');

    super({
      accelerateUrl: databaseUrl,
    });
    this.isMockMode = isMock;
  }

  async onModuleInit() {
    if (this.isMockMode) {
      console.log('PrismaService: Mock database is active. Bypassing MongoDB connection.');
      return;
    }
    
    try {
      await this.$connect();
      console.log('Successfully connected to MongoDB via Prisma.');
    } catch (err) {
      console.error('Prisma failed to connect to MongoDB:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    if (this.isMockMode) {
      return;
    }
    await this.$disconnect();
  }
}
