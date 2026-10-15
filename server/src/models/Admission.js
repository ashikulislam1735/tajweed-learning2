import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true, maxlength: 150 },
    age: { type: String, trim: true, maxlength: 20, default: '' },
    phone: { type: String, required: true, trim: true, maxlength: 50 },
    courseInterested: { type: String, trim: true, maxlength: 150, default: '' },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export const Admission = mongoose.model('Admission', admissionSchema);
