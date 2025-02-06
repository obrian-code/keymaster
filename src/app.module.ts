import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReniecController } from './reniec/reniec.controller';
import { ReniecService } from './reniec/reniec.service';
import { SunarpService } from './sunarp/sunarp.service';
import { SunarpController } from './sunarp/sunarp.controller';
import { SunatController } from './sunat/sunat.controller';
import { SunatService } from './sunat/sunat.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ReniecController, SunarpController, SunatController],
  providers: [ReniecService, SunarpService, SunatService],
})
export class AppModule {}
