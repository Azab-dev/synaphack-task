import { Schema, model, models, Types } from 'mongoose';

const RegistrationSchema = new Schema(
  {
    event: { type: Types.ObjectId, ref: 'Event', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    team: { type: Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true }
);

RegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

export default models.Registration || model('Registration', RegistrationSchema);
