import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    studentName: { type: String, required: true, trim: true, maxlength: 150 },
    studentClass: { type: String, trim: true, maxlength: 100, default: '' },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
