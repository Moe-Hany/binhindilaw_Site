'use client';

import { useTranslations, useLocale } from 'next-intl';
import Hero from '@/components/Hero';
import OurTeam from '@/components/OurTeam';
import Testimonials from '@/components/Testimonials';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <Hero />
      
      {/* Our Team Section */}
      <OurTeam />
      
      {/* Client Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default HomePage;