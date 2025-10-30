import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { ItemsModule } from './items/items.module';
import { DailyPatientsModule } from './daily-patients/daily-patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    DoctorsModule,
    PatientsModule,
    ItemsModule,
    DailyPatientsModule, 
  ],
})
export class AppModule {}
