import { Controller, Get, Query } from '@nestjs/common';
import { SunatService } from './sunat.service';

@Controller('sunat')
export class SunatController {
  constructor(private readonly sunatService: SunatService) {}

  @Get()
  async ruc(@Query('ruc') ruc: string) {
    return await this.sunatService.ruc(ruc);
  }
}
