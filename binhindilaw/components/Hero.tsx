'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { fetchHeroesData, fetchHomePageData, getBestHeroImageUrl, getBestImageUrl, HeroData, HomePageData } from '@/lib/api';

interface HeroProps {}

const Hero: React.FC<HeroProps> = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [heroesData, setHeroesData] = useState<HeroData[]>([]);
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load both heroes data and home page data (for background)
        const [heroes, homePage] = await Promise.all([
          fetchHeroesData(locale),
          fetchHomePageData()
        ]);
        
        if (heroes && heroes.length > 0) {
          setHeroesData(heroes);
        }
        if (homePage) {
          setHomePageData(homePage);
        }
      } catch (err) {
        console.error('Error loading hero data:', err);
        setError('Failed to load hero content');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [locale]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroesData.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroesData.length) % heroesData.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const backgroundImageUrl = homePageData?.background 
    ? getBestImageUrl(homePageData.background, 'large')
    : '/api/placeholder/1920/1080';

  if (error) {
    return (
      <section className={`relative min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="absolute inset-0 bg-brown-900/20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-brown-900">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isRTL ? 'مرحباً بكم في مكتب بن هندي للمحاماة' : 'Welcome to BinHindi Law'}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {isRTL ? 'شريككم القانوني الموثوق' : 'Your trusted legal partner'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentHero = heroesData[currentSlide];

  return (
    <section 
      className={`relative min-h-screen bg-cover bg-center bg-no-repeat ${isRTL ? 'rtl' : 'ltr'}`}
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      {/* Brown overlay */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundColor: 'rgba(75, 38, 21, 0.5)' 
        }}
      ></div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-brown-900/80 flex items-center justify-center z-20">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      )}

      {/* Navigation Arrow - Right Side Only */}
      {heroesData.length > 1 && (
        <button
          onClick={handleNextSlide}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 hover:scale-110`}
          aria-label={isRTL ? 'الشريحة التالية' : 'Next slide'}
        >
          <svg
            className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Dots Indicators */}
      {heroesData.length > 1 && (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-3">
          {heroesData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`${isRTL ? 'اذهب إلى الشريحة' : 'Go to slide'} ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
            
            {/* Text Content */}
            <div className={`${isRTL ? 'lg:order-2' : 'lg:order-1'} space-y-6`}>
              {currentHero ? (
                <>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    {currentHero.title}
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                    {currentHero.description}
                  </p>
                  
                  <div className="pt-4">
                    <button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-brown-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                      {isRTL ? 'اقرأ المزيد' : 'Read More'}
                    </button>
                  </div>
                </>
              ) : (
                // Fallback content
                <>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    {isRTL ? 'مرحباً بكم في مكتب بن هندي للمحاماة' : 'Welcome to BinHindi Law'}
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                    {isRTL 
                      ? 'شريككم القانوني الموثوق في تقديم الخدمات القانونية المتميزة' 
                      : 'Your trusted legal partner providing exceptional legal services'
                    }
                  </p>
                  
                  <div className="pt-4">
                    <button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-brown-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                      {isRTL ? 'اقرأ المزيد' : 'Read More'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Image Content */}
            <div className={`${isRTL ? 'lg:order-1' : 'lg:order-2'} flex justify-center lg:justify-end`}>
              {currentHero && currentHero.image && currentHero.image[0] ? (
                <div className="w-80 h-80 md:w-96 md:h-96 relative">
                  <Image
                    src={getBestHeroImageUrl(currentHero.image[0], 'medium')}
                    alt={currentHero.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 320px, 384px"
                  />
                </div>
              ) : (
                <div className="w-80 h-80 md:w-96 md:h-96 bg-gray-300 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <p className="text-lg">{isRTL ? 'صورة الخبير' : 'Expert Image'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default Hero;