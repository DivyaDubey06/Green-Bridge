import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable Cross-Origin Resource Sharing
  app.enableCors({
    origin: '*', // Allows connections from local React/Vite development server
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`GreenBridge backend server successfully started on port ${port} 🚀`);
}
bootstrap();
