import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DailyPatientsService } from './daily-patients.service';
import { CreateDailyPatientDto } from './dto/create-daily-patient.dto';
import { UpdateDailyPatientDto } from './dto/update-daily-patient.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('daily-patients')
@Controller('daily-patients')
export class DailyPatientsController {
  constructor(private readonly dailyPatientsService: DailyPatientsService) {}

  // ✅ Crear un registro diario (verifica paciente, doctor y item)
  @Post()
  @ApiOperation({ summary: 'Crear registro diario de paciente' })
  create(@Body() createDailyPatientDto: CreateDailyPatientDto) {
    return this.dailyPatientsService.create(createDailyPatientDto);
  }

  // ✅ Listar todos los registros diarios con populate
  @Get()
  @ApiOperation({ summary: 'Listar todos los registros diarios (con populate)' })
  findAll() {
    return this.dailyPatientsService.findAll();
  }

  // Buscar por FID
  @Get('by-fid/:fid_number')
  findByFid(@Param('fid_number') fid_number: string) {
    return this.dailyPatientsService.findOne(fid_number); // 👈 usa el nombre correcto
  }

  // Buscar por _id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyPatientsService.findById(id); // 👈 este método lo añadimos abajo
  }

  // ✅ Actualizar registro diario (si hay campos editables)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro diario' })
  @ApiParam({ name: 'id', example: '6721e2e5f3ab4b1b98d12a30' })
  update(
    @Param('id') id: string,
    @Body() updateDailyPatientDto: UpdateDailyPatientDto,
  ) {
    return this.dailyPatientsService.update(id, updateDailyPatientDto);
  }

  // ✅ Eliminar registro diario por FID e item_name
  @Delete(':fid_number/:item_name')
  @ApiOperation({
    summary:
      'Eliminar registro diario por FID del paciente y nombre del estudio',
  })
  @ApiParam({ name: 'fid_number', example: '12345678' })
  @ApiParam({ name: 'item_name', example: 'TOPOGRAFÍA CORNEAL' })
  remove(
    @Param('fid_number') fid_number: string,
    @Param('item_name') item_name: string,
  ) {
    return this.dailyPatientsService.remove(fid_number, item_name);
  }
}
