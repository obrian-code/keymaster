import { Controller, Get, Query } from '@nestjs/common';
import { ReniecService } from './reniec.service';

@Controller('reniec')
export class ReniecController {
  constructor(private readonly reniecService: ReniecService) {}

  @Get()
  async dni(@Query('dni') dni: string) {
    return await this.reniecService.dni(dni);
  }
}
