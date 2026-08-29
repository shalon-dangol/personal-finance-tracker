import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    budget: { type: Number, default: 0, min: 0 },
    icon: { type: String, default: '' },
    color: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent duplicate category names per user
categorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
