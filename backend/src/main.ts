import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable Cross-Origin Resource Sharing
  app.enableCors({
    origin: true, // Reflects request origin so credentials: true works across local and Vercel domains
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`GreenBridge backend server successfully started on port ${port} 🚀`);
}
bootstrap();
