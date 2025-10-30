import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyPatient } from './schema/daily-patient.schema';
import { CreateDailyPatientDto } from './dto/create-daily-patient.dto';
import { UpdateDailyPatientDto } from './dto/update-daily-patient.dto';
import { Patient } from 'src/patients/schema/patient.schema';
import { Doctor } from 'src/doctors/schema/doctor.schema';
import { Item } from 'src/items/schema/item.schema';

@Injectable()
export class DailyPatientsService {
  constructor(
    @InjectModel(DailyPatient.name) private readonly dailyModel: Model<DailyPatient>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
  ) {}

  async create(dto: CreateDailyPatientDto): Promise<DailyPatient> {
    // 🧍 1️⃣ Verificar si el paciente existe
    let patient = await this.patientModel.findOne({ fid_number: dto.patient.fid_number }).exec();

    if (!patient) {
      // Si no existe, crearlo
      patient = new this.patientModel({
        fid_number: dto.patient.fid_number,
        full_name: `${dto.patient.name} ${dto.patient.lastname}`,
        name: dto.patient.name,
        lastname: dto.patient.lastname,
        contact_info: {
          email: dto.patient.email,
          phone: dto.patient.phone,
        },
        metadata: { created_by: 'system' },
      });

      await patient.save();
    }

    // 👩‍⚕️ 2️⃣ Buscar doctor por cyclhos_name
    const doctor = await this.doctorModel.findOne({
      cyclhos_name: dto.doctor.cyclhos_name,
    });

    if (!doctor)
      throw new NotFoundException(
        `Doctor con cyclhos_name "${dto.doctor.cyclhos_name}" no encontrado`,
      );

    // 🧪 3️⃣ Buscar item (estudio)
    const item = await this.itemModel.findOne({
      cyclhos_name: dto.study.item,
    });

    if (!item)
      throw new NotFoundException(`Estudio "${dto.study.item}" no encontrado`);

    // 💾 4️⃣ Crear registro diario
    const created = new this.dailyModel({
      appointment_date: dto.appointment_date,
      appointment_time: dto.appointment_time,
      patient_id: patient.patient_id, 
      doctor_id: doctor.doctor_id,
      item_id: item.item_id,
      completed: false,
      result_url: null,
      email_status: { sent: false, sent_time: null },
      metadata: { source: dto.source || 'manual' },
    });

    return created.save();
  }

  async findAll(): Promise<DailyPatient[]> {
    return this.dailyModel
      .find()
      .populate({
        path: 'patient_id',
        select: 'fid_number name lastname contact_info',
      })
      .populate({
        path: 'doctor_id',
        select: 'full_name cyclhos_name',
      })
      .populate({
        path: 'item_id',
        select: 'cyclhos_name mapped_name',
      })
      .exec();
  }


  async findOne(fid_number: string): Promise<DailyPatient[]> {
    const records = await this.dailyModel
      .find()
      .populate({
        path: 'patient_id',
        match: { fid_number }, 
        select: 'fid_number name lastname contact_info',
      })
      .populate({
        path: 'doctor_id',
        select: 'full_name cyclhos_name',
      })
      .populate({
        path: 'item_id',
        select: 'cyclhos_name mapped_name',
      })
      .exec();

    const filtered = records.filter(r => r.patient_id !== null);

    if (!filtered.length)
      throw new NotFoundException(`No se encontraron citas para el paciente con FID ${fid_number}`);

    return filtered;
}

async findById(id: string): Promise<DailyPatient> {
  const record = await this.dailyModel
    .findById(id)
    .populate({
      path: 'patient_id',
      select: 'fid_number name lastname contact_info',
    })
    .populate({
      path: 'doctor_id',
      select: 'full_name cyclhos_name',
    })
    .populate({
      path: 'item_id',
      select: 'cyclhos_name mapped_name',
    })
    .exec();

  if (!record)
    throw new NotFoundException(`Registro diario con ID ${id} no encontrado`);

  return record;
}

  // PENDIENTE POR REVISAR 
  async update(id: string, dto: UpdateDailyPatientDto): Promise<DailyPatient> {
    const updated = await this.dailyModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Registro diario con ID ${id} no encontrado`);
    return updated;
  }

  async remove(fid_number: string, item_name: string): Promise<DailyPatient> {
    // 1️⃣ Buscar el paciente por FID
    const patient = await this.patientModel.findOne({ fid_number }).exec();
    if (!patient) {
      throw new NotFoundException(`Paciente con FID ${fid_number} no encontrado`);
    }

    // 2️⃣ Buscar el item por nombre (puede ser cyclhos_name o mapped_name)
    const item = await this.itemModel.findOne({
      $or: [{ cyclhos_name: item_name }, { mapped_name: item_name }],
    }).exec();
    if (!item) {
      throw new NotFoundException(`Estudio con nombre ${item_name} no encontrado`);
    }

    // 3️⃣ Eliminar el registro diario correspondiente
    const deleted = await this.dailyModel
      .findOneAndDelete({
        patient_id: patient._id,
        item_id: item._id,
      })
      .exec();

    if (!deleted) {
      throw new NotFoundException(
        `No se encontró registro diario para FID ${fid_number} con el estudio ${item_name}`,
      );
    }

    return deleted;
  }

}
