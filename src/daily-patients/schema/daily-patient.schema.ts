import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Patient } from 'src/patients/schema/patient.schema';
import { Doctor } from 'src/doctors/schema/doctor.schema';
import { Item } from 'src/items/schema/item.schema';

@Schema({
  timestamps: { createdAt: 'metadata.created_at', updatedAt: 'metadata.updated_at' },
})
export class DailyPatient extends Document {
  @Prop({ required: true })
  appointment_date: string;

  @Prop({ required: true })
  appointment_time: string;

  @Prop({ type: Types.ObjectId, ref: Patient.name, required: true })
  patient_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Doctor.name, required: true })
  doctor_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Item.name, required: true })
  item_id: Types.ObjectId;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: null })
  result_url: string;

  @Prop({
    type: {
      sent: { type: Boolean, default: false },
      sent_time: { type: Date, default: null },
    },
    default: {},
  })
  email_status: {
    sent: boolean;
    sent_time: Date;
  };

  @Prop({
    type: {
      source: { type: String, enum: ['excel', 'manual'], default: 'manual' },
      created_at: { type: Date },
      updated_at: { type: Date },
    },
    default: {},
  })
  metadata: {
    source: string;
    created_at: Date;
    updated_at: Date;
  };
}

export const DailyPatientSchema = SchemaFactory.createForClass(DailyPatient);
