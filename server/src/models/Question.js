import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    questionText: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    optionA: { type: String, required: true, trim: true, maxlength: 500 },
    optionB: { type: String, required: true, trim: true, maxlength: 500 },
    optionC: { type: String, required: true, trim: true, maxlength: 500 },
    optionD: { type: String, required: true, trim: true, maxlength: 500 },
    correctOption: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  },
  { timestamps: true }
);

export const Question = mongoose.model('Question', questionSchema);
