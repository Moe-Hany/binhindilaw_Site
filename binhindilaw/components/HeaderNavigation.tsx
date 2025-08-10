'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  toggleMenu,
  closeMenu,
  toggleServices,
  closeServices,
  toggleSearch,
  closeSearch,
  setSearchQuery,
} from '@/lib/features/navigationSlice';
import { fetchHomePageData, getImageUrl, HomePageData, fetchServicesData, ServiceData } from '@/lib/api';

const HeaderNavigation = () => {
  const dispatch = useAppDispatch();
  const { isMenuOpen, isServicesOpen, isSearchOpen, searchQuery } = useAppSelector(
    (state: any) => state.navigation
  );
  
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  
  const searchRef = useRef<HTMLInputElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  
  // Scroll state for navbar background change  
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Logo state from API
  const [logoUrl, setLogoUrl] = useState<string>('/logo.svg'); // Fallback to default logo
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  
  // Services state from API
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState(true);

  const isRTL = locale === 'ar';



  const navigationItems = [
    { name: t('nav.home'), href: `/${locale}` },
    { name: t('nav.about'), href: `/${locale}/about-us` },
    { name: t('nav.services'), href: '#', isDropdown: true },
    { name: t('nav.blog'), href: `/${locale}/blogs` },
    { name: t('nav.team'), href: `/${locale}/our-team` },
    { name: t('nav.contact'), href: `/${locale}/contact-us` },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        dispatch(closeServices());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle scroll events to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    // Cleanup event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch logo from API
  useEffect(() => {
    const loadLogo = async () => {
      try {
        setIsLogoLoading(true);
        const homePageData = await fetchHomePageData();
        if (homePageData?.logo) {
          setLogoUrl(getImageUrl(homePageData.logo.url));
        }
      } catch (error) {
        console.error('Error loading logo:', error);
        // Keep fallback logo
      } finally {
        setIsLogoLoading(false);
      }
    };

    loadLogo();
  }, []);

  // Fetch services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsServicesLoading(true);
        const servicesData = await fetchServicesData(locale);
        if (servicesData) {
          setServices(servicesData);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setIsServicesLoading(false);
      }
    };

    loadServices();
  }, [locale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      dispatch(closeSearch());
    }
  };

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const currentPath = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${currentPath}`);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isRTL ? 'rtl' : 'ltr'} ${isScrolled ? 'shadow-lg' : ''}`}
      style={{
        backgroundColor: isScrolled ? '#4B2615' : 'transparent',
        background: isScrolled ? '#4B2615' : 'none'
      }}
    >
      <nav 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ background: 'none', backgroundColor: 'transparent' }}
      >
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`} className="flex items-center">
              {isLogoLoading ? (
                <div className={`h-16 w-32 ${isScrolled ? 'bg-brown-700' : 'bg-white/20'} animate-pulse rounded transition-all duration-300`}></div>
              ) : (
                <Image
                  src={logoUrl}
                  alt="BinHindi Law Logo"
                  width={320}
                  height={80}
                  className="h-16 w-auto"
                  priority
                  onError={() => setLogoUrl('/logo.svg')} // Fallback on error
                />
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigationItems.map((item) => (
              item.isDropdown ? (
                /* Services Dropdown */
                <div key="services" className="relative" ref={servicesRef}>
                  <button
                    onClick={() => dispatch(toggleServices())}
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                    aria-expanded={isServicesOpen}
                    aria-haspopup="true"
                  >
                    {item.name}
                    <svg
                      className={`ml-2 h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''} ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Services Dropdown Menu */}
                  {isServicesOpen && (
                    <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-[600px] max-w-[90vw] rounded-md shadow-lg z-50`} style={{backgroundColor: '#4B2615'}}>
                      <div className="py-2">
                        {isServicesLoading ? (
                          <div className="px-4 py-2 text-white">
                            {t('loading')}...
                          </div>
                        ) : services.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {services.map((service) => (
                              <Link
                                key={service.id}
                                href={`/${locale}/services/${service.documentId}`}
                                className="px-4 py-3 text-white transition-colors duration-200 cursor-pointer hover:bg-opacity-80 block"
                                style={{backgroundColor: 'transparent'}}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#744a39'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => dispatch(closeServices())}
                              >
                                {service.title}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-2 text-white">
                            {t('services.no_services')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    placeholder={t('search.placeholder')}
                    className={`${isScrolled ? 'bg-brown-800 border border-brown-700' : 'bg-white/10 backdrop-blur-sm border border-white/20'} text-white placeholder-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 w-48 transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(closeSearch())}
                    className="ml-2 rtl:ml-0 rtl:mr-2 text-white hover:text-gray-200 transition-colors duration-200"
                    aria-label={t('search.close')}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => dispatch(toggleSearch())}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                  aria-label={t('search.open')}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={handleLanguageSwitch}
              className={`${isScrolled ? 'bg-brown-800 hover:bg-brown-700' : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'} text-white px-3 py-1 rounded-md text-sm font-medium transition-all duration-200`}
              aria-label={t('language.toggle')}
            >
              {locale === 'en' ? 'العربية' : 'English'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => dispatch(toggleMenu())}
              className="md:hidden text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-label={t('nav.mobile_menu')}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div 
              className="px-2 pt-2 pb-3 space-y-1 rounded-md mt-2 min-h-[200px]" 
              style={{backgroundColor: '#4B2615'}}
            >
              {navigationItems.map((item) => (
                item.isDropdown ? (
                  /* Mobile Services Accordion */
                  <div key="services">
                    <button
                      onClick={() => dispatch(toggleServices())}
                      className={`text-white hover:text-brown-300 hover:bg-brown-700 w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-between ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {item.name}
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''} ${isRTL ? 'order-first ml-2' : 'order-last'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Mobile Services Submenu */}
                    {isServicesOpen && (
                      <div className={`${isRTL ? 'mr-4' : 'ml-4'} mt-1 space-y-1`}>
                        {isServicesLoading ? (
                          <div className="px-3 py-2 text-white text-sm">
                            {t('loading')}...
                          </div>
                        ) : services.length > 0 ? (
                          services.map((service) => (
                            <Link
                              key={service.id}
                              href={`/${locale}/services/${service.documentId}`}
                              className="text-white block px-3 py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer"
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#744a39'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              onClick={() => {
                                dispatch(closeServices());
                                dispatch(closeMenu());
                              }}
                            >
                              {service.title}
                            </Link>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-white text-sm">
                            {t('services.no_services')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-brown-300 hover:bg-brown-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => dispatch(closeMenu())}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default HeaderNavigation; 