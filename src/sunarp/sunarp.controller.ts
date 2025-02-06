import { Controller, Get, Query } from '@nestjs/common';
import { SunarpService } from './sunarp.service';

@Controller('sunarp')
export class SunarpController {
  constructor(private readonly sunarpService: SunarpService) {}

  @Get()
  async vehiculo_placa(@Query('placa') placa: string) {
    return await this.sunarpService.vehiculo_placa(placa);
  }
}
