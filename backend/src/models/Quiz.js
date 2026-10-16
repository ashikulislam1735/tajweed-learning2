import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, default: '' },
    timeLimitMinutes: { type: Number, default: 10, min: 1, max: 180 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
