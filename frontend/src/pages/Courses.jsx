import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import CourseCard from '../components/CourseCard.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Loading, ErrorBox, Empty } from '../components/StateBox.jsx';

export default function Courses() {
  usePageTitle('কোর্সসমূহ');
  const { data, loading, error } = useFetch(api.courses, []);

  return (
    <section className="section">
      <div className="container">
        <SectionHead label="কোর্সসমূহ" title="আপনার জন্য উপযুক্ত কোর্স বেছে নিন" sub="প্রতিটি কোর্সের ফি ও মেয়াদ নিচে দেওয়া আছে। আরও জানতে WhatsApp করুন অথবা সরাসরি ভর্তি ফর্ম পূরণ করুন।" />
        {loading && <Loading />}
        {error && <ErrorBox message={error} />}
        {data && (
          <div className="course-grid">
            {data.length ? data.map((c) => <CourseCard key={c._id} course={c} />) : <Empty>এখনো কোনো কোর্স যোগ করা হয়নি।</Empty>}
          </div>
        )}
      </div>
    </section>
  );
}
