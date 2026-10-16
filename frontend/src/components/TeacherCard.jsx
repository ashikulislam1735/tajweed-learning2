export default function TeacherCard({ teacher, full = false }) {
  const bio = full ? teacher.bio : (teacher.bio || '').slice(0, 80) + ((teacher.bio || '').length > 80 ? '...' : '');
  return (
    <article className="teacher-card">
      <img src={teacher.photoUrl || '/placeholder-teacher.svg'} alt={teacher.name} loading="lazy" />
      <div className="info">
        <h3>{teacher.name}</h3>
        {teacher.designation && <span className="role">{teacher.designation}</span>}
        {full && teacher.qualification && <p><b>যোগ্যতা:</b> {teacher.qualification}</p>}
        {full && teacher.experience && <p><b>অভিজ্ঞতা:</b> {teacher.experience}</p>}
        {bio && <p className="bio">{bio}</p>}
      </div>
    </article>
  );
}
