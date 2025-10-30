import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'metadata.created_at', updatedAt: 'metadata.updated_at' },
})
export class Item extends Document {
  @Prop({ unique: true })
  item_id: string;

  @Prop({ required: true })
  cyclhos_name: string;

  @Prop({ required: true })
  mapped_name: string;

  @Prop({
    type: {
      created_at: { type: Date },
      updated_at: { type: Date },
      created_by: { type: String, default: 'system' },
    },
    default: {},
  })
  metadata: {
    created_at: Date;
    updated_at: Date;
    created_by: string;
  };
}

export const ItemSchema = SchemaFactory.createForClass(Item);
