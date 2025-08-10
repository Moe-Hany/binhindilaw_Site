'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { fetchServiceDetails, ServiceData, fetchHomePageData, HomePageData, getBestImageUrl } from '@/lib/api';

const ServiceDetailsPage = () => {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations();
  
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceId = params.serviceId as string;
  const isRTL = locale === 'ar';

  useEffect(() => {
    const loadServiceDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load both service details and home page data (for background)
        const [data, homePage] = await Promise.all([
          fetchServiceDetails(serviceId, locale),
          fetchHomePageData()
        ]);
        
        if (data) {
          setServiceData(data);
        } else {
          setError('Service not found');
        }
        
        if (homePage) {
          setHomePageData(homePage);
        }
      } catch (err) {
        console.error('Error loading service details:', err);
        setError('Failed to load service details');
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
      loadServiceDetails();
    }
  }, [serviceId, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Service not found'}
          </h1>
          <p className="text-gray-600">
            The requested service could not be found.
          </p>
        </div>
      </div>
    );
  }

  const backgroundImageUrl = homePageData?.background 
    ? getBestImageUrl(homePageData.background, 'large')
    : '/api/placeholder/1920/1080';

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Background Section */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat h-64 md:h-80"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
        }}
      >
        {/* Brown overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: 'rgba(75, 38, 21, 0.7)' 
          }}
        ></div>
      </div>

      {/* Back Button - positioned below hero background */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={`/${locale}`}
            className={`inline-flex items-center text-brown-900 hover:text-brown-700 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg 
              className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-medium">
              {isRTL ? 'عودة' : 'Back'}
            </span>
          </Link>
        </div>
      </div>

      {/* Service Title and Description Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-brown-900 mb-6">
              {serviceData.title}
            </h1>
            <div className="max-w-4xl">
              <p className="text-xl leading-relaxed text-gray-700">
                {serviceData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {serviceData.services && serviceData.services.length > 0 ? (
          <div className="space-y-12">
            {serviceData.services.map((service: ServiceData) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className={`text-2xl md:text-3xl font-bold text-brown-900 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {service.heading}
                </h2>
                
                {service.items && service.items.length > 0 && (
                  <div className="space-y-4">
                    {service.items.map((item: any) => (
                      <div 
                        key={item.id}
                        className="flex items-start"
                      >
                        <div className="flex-shrink-0 mt-2">
                          <div 
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: '#4B2615' }}
                          ></div>
                        </div>
                        <p className={`text-gray-700 leading-relaxed text-lg ${isRTL ? 'mr-6' : 'ml-4'}`}>
                          {item.item}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">
              No detailed services information available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
