import Link from 'next/link';
import FeedbackConsultationBox from './FeedbackConsultationBox';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        {/* Advice & Consultation Card (Phone initially hidden, opens on click) */}
        <FeedbackConsultationBox />

        <div className="footer__top">
          <div className="footer__brand">
            <Link href="/blog" className="footer__logo" aria-label="ইসলাহ ব্লগ হোমপেজ">
              ইসলাহ<span className="footer__logo-dot">.</span>ব্লগ
            </Link>
            <p className="footer__tagline">
              রাসূলুল্লাহ ﷺ-এর সিরাত, জীবন, চরিত্র ও শিক্ষা নিয়ে প্রামাণ্য জ্ঞানভিত্তিক ডিজিটাল প্রকাশনা।
            </p>
            <p
              style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: '1.1rem',
                color: 'var(--color-brand-primary)',
                marginTop: 'var(--space-2)',
              }}
            >
              اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
            </p>
          </div>

          <div className="footer__links-group">
            <div className="footer__links">
              <h3 className="footer__links-title">আবিষ্কার</h3>
              <Link href="/blog" className="footer__link">প্রধান পাতা</Link>
              <Link href="/blog/topics" className="footer__link">সিরাত পর্বসমূহ</Link>
              <Link href="/blog/authors" className="footer__link">লেখক ও গবেষক</Link>
              <Link href="/blog/bookmarks" className="footer__link">সংরক্ষিত প্রবন্ধ</Link>
              <Link href="/blog/search" className="footer__link">অনুসন্ধান</Link>
            </div>

            <div className="footer__links">
              <h3 className="footer__links-title">লেখক ও প্ল্যাটফর্ম</h3>
              <Link href="/blog/about" className="footer__link">আমাদের লক্ষ্য ও দর্শন</Link>
              <Link href="/blog/guidelines" className="footer__link">লেখার নীতিমালা</Link>
              <Link href="/blog/apply" className="footer__link">লেখক হিসেবে আবেদন</Link>
              <Link href="/blog/dashboard" className="footer__link">লেখক ড্যাশবোর্ড</Link>
            </div>

            <div className="footer__links">
              <h3 className="footer__links-title">ভাষা ও প্রকাশনা</h3>
              <span className="footer__link footer__link--active">বাংলা (মূল)</span>
              <span className="footer__link footer__link--disabled">العربية (শীঘ্রই)</span>
              <span className="footer__link footer__link--disabled">English (Soon)</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} ইসলাহ ব্লগ — সর্বস্বত্ব সংরক্ষিত। প্রামাণ্য ইসলামিক প্রবন্ধ ও সীরাত প্রকাশনা।
          </p>
        </div>
      </div>
    </footer>
  );
}
