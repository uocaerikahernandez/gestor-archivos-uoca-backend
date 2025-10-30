import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'TOPOGRAFÍA CORNEAL' })
  @IsString()
  @IsNotEmpty()
  cyclhos_name: string;

  @ApiProperty({ example: 'Corneal Topography' })
  @IsString()
  @IsNotEmpty()
  mapped_name: string;
}
