import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const server = express();
let app;

async function createNestApp() {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { logger: ['error', 'warn', 'log'] }
    );

    // Enable CORS
    app.enableCors({
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3001',
        'https://preview--roomie-suite.lovable.app',
        'http://localhost:8080',
      ],
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Global prefix
    app.setGlobalPrefix('api');

    await app.init();
  }
  return app;
}

// Export handler for Vercel Serverless
export default async (req, res) => {
  await createNestApp();
  return server(req, res);
};

// For local development
if (require.main === module) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3001',
        'https://preview--roomie-suite.lovable.app',
        'http://localhost:8080',
      ],
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Global prefix
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  }
  bootstrap();
}