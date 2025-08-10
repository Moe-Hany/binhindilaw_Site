'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { fetchTeamMembersData, getBestHeroImageUrl, TeamMemberData } from '@/lib/api';

interface OurTeamProps {}

const OurTeam: React.FC<OurTeamProps> = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Number of members to show at once
  const membersPerView = 3;

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const teamData = await fetchTeamMembersData(locale);
        
        if (teamData && teamData.length > 0) {
          setTeamMembers(teamData);
        }
      } catch (err) {
        console.error('Error loading team data:', err);
        setError('Failed to load team data');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, [locale]);

  const handleNextSlide = () => {
    if (teamMembers.length > membersPerView) {
      setCurrentSlide((prev) => {
        const maxSlides = Math.ceil(teamMembers.length / membersPerView) - 1;
        return prev >= maxSlides ? 0 : prev + 1;
      });
    }
  };

  const handlePrevSlide = () => {
    if (teamMembers.length > membersPerView) {
      setCurrentSlide((prev) => {
        const maxSlides = Math.ceil(teamMembers.length / membersPerView) - 1;
        return prev <= 0 ? maxSlides : prev - 1;
      });
    }
  };

  const copyToClipboard = async (text: string, type: 'phone' | 'email') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(`${type}-${text}`);
      setTimeout(() => setCopiedText(null), 2000); // Clear after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedText(`${type}-${text}`);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  if (error || teamMembers.length === 0) {
    return null; // Don't render section if no team data
  }

  // Get current visible members
  const startIndex = currentSlide * membersPerView;
  const visibleMembers = teamMembers.slice(startIndex, startIndex + membersPerView);

  return (
    <section className={`py-16 bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-brown-900 mb-4">
            {isRTL ? 'فريقنا' : 'Our Team'}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {isRTL 
              ? 'نحن فريق من المحامين المتخصصين ذوي الخبرة العالية في مختلف مجالات القانون، ملتزمون بتقديم أفضل الخدمات القانونية لعملائنا'
              : 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s'
            }
          </p>
        </div>

        {/* Team Members Carousel */}
        <div className="relative">
          
          {/* Navigation Arrows */}
          {teamMembers.length > membersPerView && (
            <>
              <button
                onClick={handlePrevSlide}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-0 -mr-6' : 'left-0 -ml-6'} z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 text-brown-900 transition-all duration-200 hover:scale-110`}
                aria-label={isRTL ? 'الفريق السابق' : 'Previous team'}
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
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-0 -ml-6' : 'right-0 -mr-6'} z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 text-brown-900 transition-all duration-200 hover:scale-110`}
                aria-label={isRTL ? 'الفريق التالي' : 'Next team'}
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
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-900"></div>
            </div>
          )}

          {/* Team Members Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-center"
                >
                  {/* Member Image */}
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    {member.image ? (
                      <Image
                        src={getBestHeroImageUrl(member.image, 'medium')}
                        alt={member.name}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Badge (like in the image) */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-brown-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      M
                    </div>
                  </div>

                  {/* Member Info */}
                  <h3 className="text-xl font-bold text-brown-900 mb-2">
                    {member.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
                    {member.role}
                  </p>

                  {/* Contact Icons */}
                  <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                    
                    {/* Phone Icon */}
                    <button
                      onClick={() => copyToClipboard(member.phone, 'phone')}
                      className="p-2 bg-gray-100 hover:bg-brown-100 rounded-full text-brown-600 transition-colors duration-200 relative group"
                      aria-label={`${isRTL ? 'انسخ رقم الهاتف' : 'Copy phone number'}: ${member.phone}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {copiedText === `phone-${member.phone}` ? (isRTL ? 'تم النسخ!' : 'Copied!') : member.phone}
                      </div>
                    </button>

                    {/* Email Icon */}
                    <button
                      onClick={() => copyToClipboard(member.email, 'email')}
                      className="p-2 bg-gray-100 hover:bg-brown-100 rounded-full text-brown-600 transition-colors duration-200 relative group"
                      aria-label={`${isRTL ? 'انسخ البريد الإلكتروني' : 'Copy email'}: ${member.email}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {copiedText === `email-${member.email}` ? (isRTL ? 'تم النسخ!' : 'Copied!') : member.email}
                      </div>
                    </button>

                    {/* Message/Chat Icon */}
                    <button
                      className="p-2 bg-gray-100 hover:bg-brown-100 rounded-full text-brown-600 transition-colors duration-200"
                      aria-label={isRTL ? 'إرسال رسالة' : 'Send message'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
