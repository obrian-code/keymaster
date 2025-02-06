import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReniecController } from './reniec/reniec.controller';
import { ReniecService } from './reniec/reniec.service';
import { SunarpService } from './sunarp/sunarp.service';
import { SunarpController } from './sunarp/sunarp.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ReniecController, SunarpController],
  providers: [ReniecService, SunarpService],
})
export class AppModule {}
