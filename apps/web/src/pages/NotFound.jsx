import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function NotFound() {
  usePageTitle('পেজ পাওয়া যায়নি');
  return (
    <section className="section">
      <div className="container narrow center">
        <h1 className="arabic big-arabic">٤٠٤</h1>
        <h2>পেজটি পাওয়া যায়নি</h2>
        <p className="muted">লিংকটা ভুল হতে পারে বা পেজটি সরানো হয়েছে।</p>
        <Link to="/" className="btn btn-gold">হোমপেজে ফিরুন</Link>
      </div>
    </section>
  );
}
