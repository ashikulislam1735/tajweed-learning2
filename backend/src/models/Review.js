import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    reviewText: { type: String, required: true, trim: true, maxlength: 1000 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
