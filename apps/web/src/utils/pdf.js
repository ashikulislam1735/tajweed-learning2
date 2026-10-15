// কুইজের ফলাফল PDF করে নামানো।
// বাংলা ফন্ট (public/bengali-font-data.js, প্রায় ৬০০ KB) শুধু PDF বাটনে ক্লিক করলেই লোড হয়,
// যাতে সাইট আগে থেকেই ভারী না হয়।
let fontPromise;

function loadFontScript() {
  if (!fontPromise) {
    fontPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/bengali-font-data.js';
      s.onload = resolve;
      s.onerror = () => {
        fontPromise = null;
        reject(new Error('বাংলা ফন্ট লোড করা যায়নি।'));
      };
      document.head.appendChild(s);
    });
  }
  return fontPromise;
}

export async function downloadResultPdf(result) {
  const [{ jsPDF }] = await Promise.all([import('jspdf'), loadFontScript()]);
  // ফন্ট ফাইলে `const NotoSansBengaliBase64 = "..."` আছে
  // eslint-disable-next-line no-undef
  const fontData = typeof NotoSansBengaliBase64 !== 'undefined' ? NotoSansBengaliBase64 : null;
  if (!fontData) throw new Error('বাংলা ফন্ট পাওয়া যায়নি।');

  const doc = new jsPDF();
  doc.addFileToVFS('NotoSansBengali.ttf', fontData);
  doc.addFont('NotoSansBengali.ttf', 'NotoBengali', 'normal');
  doc.setFont('NotoBengali');

  let y = 18;
  doc.setFontSize(16);
  doc.text('কুইজের ফলাফল', 14, y);
  y += 10;
  doc.setFontSize(11);
  doc.text(`কুইজ: ${result.quizTitle}`, 14, y);
  y += 7;
  doc.text(`নাম: ${result.studentName}`, 14, y);
  y += 7;
  doc.text(`স্কোর: ${result.score}/${result.total} (${result.percentage}%)`, 14, y);
  y += 10;

  if (!result.wrong.length) {
    doc.text('সবগুলো উত্তর সঠিক হয়েছে!', 14, y);
  } else {
    doc.setFontSize(12);
    doc.text('যেগুলো ভুল হয়েছে:', 14, y);
    y += 8;
    doc.setFontSize(10);
    result.wrong.forEach((w, i) => {
      const blocks = [
        [`${i + 1}. ${w.question}`, 14, 2],
        [`তোমার উত্তর: ${w.given}`, 18, 1],
        [`সঠিক উত্তর: ${w.correct}`, 18, 6],
      ];
      blocks.forEach(([text, x, gap]) => {
        const lines = doc.splitTextToSize(text, 180);
        if (y + lines.length * 6 > 280) {
          doc.addPage();
          y = 18;
        }
        doc.text(lines, x, y);
        y += lines.length * 6 + gap;
      });
    });
  }

  doc.save(`quiz-result-${result.studentName.replace(/\s+/g, '_')}.pdf`);
}
