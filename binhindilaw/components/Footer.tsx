'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocale, useTranslations } from 'next-intl';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  subscribeUser, 
  resetSubscriptionState, 
  clearError 
} from '@/store/subscriptionSlice';
import { RootState, AppDispatch } from '@/lib/store';

// Validation schema
const subscriptionSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address'
    ),
});

interface SubscriptionFormValues {
  email: string;
}

const Footer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale();
  const t = useTranslations('footer');
  const { isLoading, isSuccess, error } = useSelector(
    (state: RootState) => state.subscription
  );

  const isRTL = locale === 'ar';

  // Reset success state after 5 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetSubscriptionState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch]);

  const handleSubscribe = async (
    values: SubscriptionFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      await dispatch(subscribeUser(values.email)).unwrap();
      resetForm();
    } catch (error) {
      // Error is handled by Redux state
      console.error('Subscription error:', error);
    }
  };

  const handleErrorDismiss = () => {
    dispatch(clearError());
  };

  return (
    <footer 
      className={`text-white py-6 ${isRTL ? 'rtl' : 'ltr'}`}
      style={{ backgroundColor: '#4B2615' }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          {/* Left Side - Navigation Links */}
          <div className={`flex flex-wrap gap-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <button
              className="text-white hover:text-white/80 transition-colors duration-200 cursor-pointer text-sm"
              tabIndex={0}
              aria-label={t('about')}
              onClick={() => console.log('About clicked')}
              onKeyDown={(e) => e.key === 'Enter' && console.log('About clicked')}
            >
              {t('about')}
            </button>
            <button
              className="text-white hover:text-white/80 transition-colors duration-200 cursor-pointer text-sm"
              tabIndex={0}
              aria-label={t('ourStrategy')}
              onClick={() => console.log('Our Strategy clicked')}
              onKeyDown={(e) => e.key === 'Enter' && console.log('Our Strategy clicked')}
            >
              {t('ourStrategy')}
            </button>
            <button
              className="text-white hover:text-white/80 transition-colors duration-200 cursor-pointer text-sm"
              tabIndex={0}
              aria-label={t('ourAdvantages')}
              onClick={() => console.log('Our Advantages clicked')}
              onKeyDown={(e) => e.key === 'Enter' && console.log('Our Advantages clicked')}
            >
              {t('ourAdvantages')}
            </button>
            <button
              className="text-white hover:text-white/80 transition-colors duration-200 cursor-pointer text-sm"
              tabIndex={0}
              aria-label={t('socialResponsibility')}
              onClick={() => console.log('Social Responsibility clicked')}
              onKeyDown={(e) => e.key === 'Enter' && console.log('Social Responsibility clicked')}
            >
              {t('socialResponsibility')}
            </button>
            <button
              className="text-white hover:text-white/80 transition-colors duration-200 cursor-pointer text-sm"
              tabIndex={0}
              aria-label={t('ourServices')}
              onClick={() => console.log('Our Services clicked')}
              onKeyDown={(e) => e.key === 'Enter' && console.log('Our Services clicked')}
            >
              {t('ourServices')}
            </button>
          </div>

          {/* Right Side - Subscription Form, Contacts, and Social Icons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Subscription Form */}
            <div className="flex items-center gap-2">
              <Formik
                initialValues={{ email: '' }}
                validationSchema={subscriptionSchema}
                onSubmit={handleSubscribe}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="flex items-center gap-2">
                    <div className="relative">
                      <Field
                        type="email"
                        name="email"
                        placeholder={t('email')}
                        className={`px-3 py-1.5 bg-white text-gray-900 text-sm rounded focus:outline-none focus:ring-2 focus:ring-amber-400 w-32 sm:w-40 ${
                          errors.email && touched.email ? 'border border-red-500' : ''
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                        disabled={isLoading || isSubmitting}
                        aria-label={t('email')}
                      />
                      {errors.email && touched.email && (
                        <div className="absolute top-full left-0 mt-1 text-red-300 text-xs whitespace-nowrap">
                          <ErrorMessage name="email" />
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      className="disabled:cursor-not-allowed text-white text-sm font-medium py-1.5 px-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brown-400 whitespace-nowrap"
                      style={{ 
                        backgroundColor: isLoading || isSubmitting ? '#2c1409' : '#744a39',
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading && !isSubmitting) {
                          e.currentTarget.style.backgroundColor = '#2c1409';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading && !isSubmitting) {
                          e.currentTarget.style.backgroundColor = '#744a39';
                        }
                      }}
                      aria-label={isLoading || isSubmitting ? t('subscribing') : t('subscribeButton')}
                    >
                      {isLoading || isSubmitting ? t('subscribing') : t('subscribeButton')}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            {/* Contacts Label */}
            <span className="text-white text-sm">{t('contacts')}</span>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Twitter Icon */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors duration-200"
                tabIndex={0}
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              {/* Facebook Icon */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors duration-200"
                tabIndex={0}
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Google+ Icon */}
              <a
                href="https://plus.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-400 transition-colors duration-200"
                tabIndex={0}
                aria-label="Google Plus"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8 13.5h4.1c-.2 1.1-1.2 3.2-4.1 3.2-2.5 0-4.5-2.1-4.5-4.6s2-4.6 4.5-4.6c1.4 0 2.3.6 2.8 1.1l.9-.9C10.5 6.8 9.1 6.2 7.8 6.2c-3.1 0-5.6 2.5-5.6 5.6s2.5 5.6 5.6 5.6c3.2 0 5.4-2.3 5.4-5.5 0-.4 0-.7-.1-1h-5.3v1.6zm13.9 0v1.3h-1.3v1.3h-1.3v-1.3h-1.3V13.5h1.3v-1.3h1.3v1.3h1.3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {isSuccess && (
          <div className="bg-green-600 text-white p-2 rounded text-sm mb-4 max-w-md">
            {t('successMessage')}
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-2 rounded text-sm mb-4 max-w-md relative">
            <span>{t('errorPrefix')}{error}</span>
            <button
              onClick={handleErrorDismiss}
              className="absolute top-1 right-1 text-white hover:text-red-200 focus:outline-none"
              aria-label="Dismiss error"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Bottom Section - Copyright */}
        <div className={`border-t pt-4 ${isRTL ? 'text-left' : 'text-right'}`} style={{ borderColor: '#744a39' }}>
          <p className="text-white/80 text-xs">
            {t('footerText')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
