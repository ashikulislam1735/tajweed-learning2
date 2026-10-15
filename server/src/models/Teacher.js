import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    designation: { type: String, trim: true, maxlength: 150, default: '' },
    qualification: { type: String, trim: true, maxlength: 255, default: '' },
    experience: { type: String, trim: true, maxlength: 100, default: '' },
    bio: { type: String, trim: true, default: '' },
    photoUrl: { type: String, default: '' },
    photoPublicId: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model('Teacher', teacherSchema);
