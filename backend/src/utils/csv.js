// ডেটাকে CSV টেক্সটে রূপান্তর (এক্সেলে বাংলা ঠিক দেখানোর জন্য শুরুতে BOM)
const escape = (v) => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(headers, rows) {
  const lines = [headers, ...rows].map((r) => r.map(escape).join(','));
  return '\uFEFF' + lines.join('\r\n');
}
