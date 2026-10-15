import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import CountUp from '../components/CountUp.jsx';
import MakhrajCard from '../components/MakhrajCard.jsx';
import PrayerStrip from '../components/PrayerStrip.jsx';
import CourseCard from '../components/CourseCard.jsx';
import TeacherCard from '../components/TeacherCard.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Loading, ErrorBox, Empty } from '../components/StateBox.jsx';

export default function Home() {
  usePageTitle('');
  const { data, loading, error } = useFetch(api.home, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="hero-note">অনলাইন ও অফলাইন উভয় ক্লাস উপলব্ধ</p>
            <h1>
              <span className="arabic">شُدَّة وَتَجْوِيد</span>
              শুদ্ধ তিলাওয়াত, সুন্দর জীবন
            </h1>
            <p className="hero-text">
              মাখরাজ ও তাজভীদের নিয়ম মেনে শুদ্ধভাবে কুরআন পড়া শিখুন — অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে, ধাপে ধাপে।
            </p>
            <div className="hero-actions">
              <Link to="/admission" className="btn btn-gold">ফ্রি ক্লাস করুন</Link>
              <Link to="/courses" className="btn btn-outline">কোর্সসমূহ দেখুন</Link>
            </div>
            {data && (
              <div className="hero-stats">
                <div><strong><CountUp to={data.liveStudentCount} suffix="+" /></strong><span>ছাত্র-ছাত্রী শুদ্ধ করে পড়ছে</span></div>
                <div><strong><CountUp to={data.teacherTotal} /></strong><span>অভিজ্ঞ শিক্ষক</span></div>
                <div><strong><CountUp to={data.courseTotal} /></strong><span>ধরনের কোর্স</span></div>
              </div>
            )}
          </div>
          <MakhrajCard />
        </div>
      </section>

      <PrayerStrip />

      {loading && <div className="container"><Loading /></div>}
      {error && <div className="container"><ErrorBox message={error} /></div>}

      {data && (
        <>
          <section className="section">
            <div className="container">
              <SectionHead label="আমাদের কোর্সসমূহ" title="যেখান থেকেই শুরু করুন, একটা পথ আছে" sub="বয়স ও দক্ষতা অনুযায়ী ধাপে ধাপে সাজানো কোর্স — নূরানী থেকে হিফজ পর্যন্ত।" />
              <div className="course-grid">
                {data.courses.length ? data.courses.map((c) => <CourseCard key={c._id} course={c} short />) : <Empty>এখনো কোনো কোর্স যোগ করা হয়নি।</Empty>}
              </div>
            </div>
          </section>

          <section className="section section-white">
            <div className="container">
              <SectionHead label="আমাদের শিক্ষকবৃন্দ" title="অভিজ্ঞ ও সার্টিফায়েড শিক্ষক" />
              <div className="teacher-grid">
                {data.teachers.length ? data.teachers.map((t) => <TeacherCard key={t._id} teacher={t} />) : <Empty>এখনো কোনো শিক্ষক প্রোফাইল যোগ করা হয়নি।</Empty>}
              </div>
            </div>
          </section>

          {data.reviews.length > 0 && (
            <section className="section">
              <div className="container">
                <SectionHead label="অভিভাবক ও ছাত্রদের মতামত" title="তারা যা বলেছেন" />
                <div className="review-grid">
                  {data.reviews.map((r) => (
                    <figure className="review-card" key={r._id}>
                      <blockquote>“{r.reviewText}”</blockquote>
                      <figcaption>— {r.name}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
