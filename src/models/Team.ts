import { Schema, model, models, Types } from 'mongoose';

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default models.Team || model('Team', TeamSchema);
