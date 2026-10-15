import { Teacher } from '../models/Teacher.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { pick } from '../utils/pick.js';

const FIELDS = ['name', 'designation', 'qualification', 'experience', 'bio', 'displayOrder'];

export const list = asyncHandler(async (_req, res) => {
  res.json(await Teacher.find().sort({ displayOrder: 1, createdAt: 1 }));
});

export const create = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (!data.name) throw new HttpError(400, 'শিক্ষকের নাম দিন।');
  if (req.file) {
    const { url, publicId } = await uploadImage(req.file.buffer, 'teachers');
    data.photoUrl = url;
    data.photoPublicId = publicId;
  }
  res.status(201).json(await Teacher.create(data));
});

export const update = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new HttpError(404, 'শিক্ষক পাওয়া যায়নি।');

  const data = pick(req.body, FIELDS);
  if (data.name === '') throw new HttpError(400, 'শিক্ষকের নাম খালি রাখা যাবে না।');
  Object.assign(teacher, data);

  if (req.file) {
    const oldId = teacher.photoPublicId;
    const { url, publicId } = await uploadImage(req.file.buffer, 'teachers');
    teacher.photoUrl = url;
    teacher.photoPublicId = publicId;
    await deleteImage(oldId); // নতুন ছবি সেভ হওয়ার পর পুরনোটা মুছি
  }
  await teacher.save();
  res.json(teacher);
});

export const remove = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) throw new HttpError(404, 'শিক্ষক পাওয়া যায়নি।');
  await deleteImage(teacher.photoPublicId);
  res.json({ message: 'শিক্ষক মুছে ফেলা হয়েছে।' });
});
