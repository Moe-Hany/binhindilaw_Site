'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { fetchClientsData, getBestHeroImageUrl, ClientData } from '@/lib/api';

interface TestimonialsProps {}

const Testimonials: React.FC<TestimonialsProps> = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [clients, setClients] = useState<ClientData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClientsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const clientsData = await fetchClientsData(locale);
        
        if (clientsData && clientsData.length > 0) {
          setClients(clientsData);
        }
      } catch (err) {
        console.error('Error loading clients data:', err);
        setError('Failed to load testimonials');
      } finally {
        setIsLoading(false);
      }
    };

    loadClientsData();
  }, [locale]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % clients.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + clients.length) % clients.length);
  };

  if (error || clients.length === 0) {
    return null; // Don't render section if no client data
  }

  const currentClient = clients[currentSlide];

  return (
    <>
      <section 
        className={`py-20 ${isRTL ? 'rtl' : 'ltr'}`}
        style={{
          backgroundColor: '#4B2615' // Brown background matching the image
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isRTL ? 'ما يقوله عملاؤنا' : 'What our clients are saying'}
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              {isRTL 
                ? 'يتراوح عملاؤنا من المستثمرين الأفراد إلى الشركات الدولية المحلية بالإضافة إلى الشركات متعددة الجنسيات التي تضم أكثر من 500 شركة'
                : 'Our clients range from individual investors, to local international as well as fortune 500 companies.Our clients range from individual investors, to local international as well as fortune 500 companies.'
              }
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Testimonial Content */}
          {!isLoading && currentClient && (
            <div className="relative">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
                
                {/* Client Image */}
                <div className={`${isRTL ? 'lg:order-2' : 'lg:order-1'} flex justify-center lg:justify-start`}>
                  <div className="w-80 h-80 md:w-96 md:h-96 relative">
                    {currentClient.image && currentClient.image[0] ? (
                      <Image
                        src={getBestHeroImageUrl(currentClient.image[0], 'medium')}
                        alt={currentClient.name}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="(max-width: 768px) 320px, 384px"
                      />
                    ) : (
                      <div className="w-full h-full bg-brown-700 rounded-2xl flex items-center justify-center">
                        <svg className="w-20 h-20 text-brown-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Testimonial Text */}
                <div className={`${isRTL ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                  <div className="text-white/90 text-lg md:text-xl leading-relaxed">
                    <svg 
                      className={`w-8 h-8 text-white/40 mb-4 ${isRTL ? 'float-right ml-2' : 'float-left mr-2'}`} 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                    </svg>
                    <p className="text-justify">
                      {currentClient.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-white/20 pt-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {currentClient.name}
                    </h3>
                    <p className="text-white/70 text-lg mb-1">
                      {currentClient.role}
                    </p>
                    <p className="text-white/60">
                      {currentClient.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              {clients.length > 1 && (
                <div className={`flex space-x-4 rtl:space-x-reverse mt-12 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                  <button
                    onClick={handlePrevSlide}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 hover:scale-110"
                    aria-label={isRTL ? 'العميل السابق' : 'Previous client'}
                  >
                    <svg
                      className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 hover:scale-110"
                    aria-label={isRTL ? 'العميل التالي' : 'Next client'}
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
                </div>
              )}

              {/* Slide Indicators */}
              {clients.length > 1 && (
                <div className="flex justify-center space-x-2 rtl:space-x-reverse mt-8">
                  {clients.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide 
                          ? 'bg-white scale-125' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`${isRTL ? 'اذهب إلى العميل' : 'Go to client'} ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* White Space Section */}
      <section className="bg-white py-4">
        {/* Empty white space */}
      </section>
    </>
  );
};

export default Testimonials;
