import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    levelNo: { type: Number, default: 0 },
    fee: { type: String, trim: true, default: '' },
    duration: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);
