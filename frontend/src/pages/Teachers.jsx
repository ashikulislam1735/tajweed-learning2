import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import TeacherCard from '../components/TeacherCard.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Loading, ErrorBox, Empty } from '../components/StateBox.jsx';

export default function Teachers() {
  usePageTitle('শিক্ষকবৃন্দ');
  const { data, loading, error } = useFetch(api.teachers, []);

  return (
    <section className="section">
      <div className="container">
        <SectionHead label="শিক্ষকবৃন্দ" title="আমাদের অভিজ্ঞ শিক্ষক পরিবার" sub="প্রতিটি শিক্ষক যথাযথ যোগ্যতা ও অভিজ্ঞতা সম্পন্ন।" />
        {loading && <Loading />}
        {error && <ErrorBox message={error} />}
        {data && (
          <div className="teacher-grid">
            {data.length ? data.map((t) => <TeacherCard key={t._id} teacher={t} full />) : <Empty>এখনো কোনো শিক্ষক প্রোফাইল যোগ করা হয়নি।</Empty>}
          </div>
        )}
      </div>
    </section>
  );
}
