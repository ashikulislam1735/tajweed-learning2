import { Link } from 'react-router-dom';

export default function CourseCard({ course, short = false }) {
  const text = short && course.description.length > 90 ? course.description.slice(0, 90) + '...' : course.description;
  return (
    <article className="course-card">
      <div className="level-no" aria-label={`লেভেল ${course.levelNo}`}>{course.levelNo}</div>
      <h3>{course.title}</h3>
      <div className="course-meta">
        <span><b>ফি:</b> {course.fee}</span>
        <span><b>মেয়াদ:</b> {course.duration}</span>
      </div>
      <p>{text}</p>
      <Link to={`/admission?course=${encodeURIComponent(course.title)}`} className="btn btn-outline-dark">
        ভর্তি হোন
      </Link>
    </article>
  );
}
