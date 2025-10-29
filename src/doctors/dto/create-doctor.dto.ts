import { IsString, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ContactInfoDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  fid_number: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  cyclhos_name: string;

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contact_info: ContactInfoDto;
}
