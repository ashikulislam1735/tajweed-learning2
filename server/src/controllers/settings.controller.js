import { Setting } from '../models/Setting.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { pick } from '../utils/pick.js';

const FIELDS = ['siteName', 'phone', 'whatsapp', 'email', 'address', 'mapEmbedUrl', 'facebookUrl', 'youtubeUrl', 'baseStudentCount'];

export const get = asyncHandler(async (_req, res) => {
  res.json(await Setting.getSite());
});

export const update = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (data.whatsapp) data.whatsapp = data.whatsapp.replace(/[^0-9]/g, ''); // wa.me এর জন্য শুধু সংখ্যা
  const site = await Setting.findOneAndUpdate({ key: 'site' }, { $set: data }, { new: true, upsert: true, runValidators: true });
  res.json(site);
});
