// body থেকে শুধু অনুমোদিত ফিল্ডগুলো নেয় (বাকি সব ফেলে দেয়) এবং টেক্সট trim করে
export function pick(body, fields) {
  const out = {};
  for (const f of fields) {
    if (body[f] !== undefined) {
      out[f] = typeof body[f] === 'string' ? body[f].trim() : body[f];
    }
  }
  return out;
}
