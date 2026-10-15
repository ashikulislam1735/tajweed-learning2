import mongoose from 'mongoose';

// পুরো সাইটের জন্য মাত্র একটা ডকুমেন্ট (key = "site")
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    siteName: { type: String, default: 'Tajweed Learning Centre' },
    phone: { type: String, default: '01700000000' },
    whatsapp: { type: String, default: '8801700000000' },
    email: { type: String, default: 'info@tajweedcentre.com' },
    address: { type: String, default: 'ঢাকা, বাংলাদেশ' },
    mapEmbedUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    baseStudentCount: { type: Number, default: 1200 },
  },
  { timestamps: true }
);

settingSchema.statics.getSite = function () {
  return this.findOneAndUpdate({ key: 'site' }, { $setOnInsert: { key: 'site' } }, { new: true, upsert: true });
};

export const Setting = mongoose.model('Setting', settingSchema);
