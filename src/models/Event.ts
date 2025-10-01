import { Schema, model, models } from 'mongoose';

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
  },
  { timestamps: true }
);

export default models.Event || model('Event', EventSchema);
