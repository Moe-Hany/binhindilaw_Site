'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'team' | 'service';
  href: string;
}

interface SearchPageProps {}

const SearchPage: React.FC<SearchPageProps> = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Mock search function - replace with actual search implementation
  const handlePerformSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data - replace with actual search API call
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Ahmed Al-Rashid',
        description: 'Senior Partner specializing in Corporate Law',
        type: 'team',
        href: `/${locale}/our-team/ahmed-al-rashid`
      },
      {
        id: '2',
        title: t('services.legal_consultation'),
        description: 'Professional legal advice and consultation services',
        type: 'service',
        href: `/${locale}/services/legal-consultation`
      },
      {
        id: '3',
        title: 'Sarah Johnson',
        description: 'Associate specializing in Contract Law',
        type: 'team',
        href: `/${locale}/our-team/sarah-johnson`
      },
      {
        id: '4',
        title: t('services.contract_drafting'),
        description: 'Professional contract drafting and review services',
        type: 'service',
        href: `/${locale}/services/contract-drafting`
      },
      {
        id: '5',
        title: 'Mohammed bin Hindi',
        description: 'Founding Partner and Senior Advocate',
        type: 'team',
        href: `/${locale}/our-team/mohammed-bin-hindi`
      },
    ];

    // Filter results based on search query
    return mockResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const searchData = async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const searchResults = await handlePerformSearch(query);
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsLoading(false);
      }
    };

    searchData();
  }, [query, t, locale]);

  const teamResults = results.filter(result => result.type === 'team');
  const serviceResults = results.filter(result => result.type === 'service');

  return (
    <div className={`min-h-screen bg-amber-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            {t('search.results')}
          </h1>
          {query && (
            <p className="text-amber-700 text-lg">
              {isRTL 
                ? `نتائج البحث عن: "${query}"`
                : `Search results for: "${query}"`
              }
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-amber-600 text-xl mb-4">
              {t('search.no_results')}
            </div>
            <p className="text-amber-500">
              {isRTL 
                ? 'حاول استخدام كلمات مختلفة أو أكثر عمومية'
                : 'Try using different or more general keywords'
              }
            </p>
          </div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-8">
            
            {/* Team Results */}
            {teamResults.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-200 pb-2">
                  {t('search.teams')}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {teamResults.map((result) => (
                    <a
                      key={result.id}
                      href={result.href}
                      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-amber-500"
                      tabIndex={0}
                      role="link"
                      aria-label={`${isRTL ? 'عرض ملف' : 'View profile of'} ${result.title}`}
                    >
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">
                        {result.title}
                      </h3>
                      <p className="text-amber-700">
                        {result.description}
                      </p>
                      <div className="mt-3 text-amber-600 text-sm font-medium">
                        {isRTL ? 'عضو الفريق' : 'Team Member'}
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Service Results */}
            {serviceResults.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-200 pb-2">
                  {t('search.services')}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {serviceResults.map((result) => (
                    <a
                      key={result.id}
                      href={result.href}
                      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-amber-600"
                      tabIndex={0}
                      role="link"
                      aria-label={`${isRTL ? 'عرض خدمة' : 'View service'} ${result.title}`}
                    >
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">
                        {result.title}
                      </h3>
                      <p className="text-amber-700">
                        {result.description}
                      </p>
                      <div className="mt-3 text-amber-600 text-sm font-medium">
                        {isRTL ? 'خدمة قانونية' : 'Legal Service'}
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && !isLoading && (
          <div className="text-center py-12">
            <div className="text-amber-600 text-xl mb-4">
              {isRTL 
                ? 'ابدأ البحث للعثور على فريقنا وخدماتنا'
                : 'Start searching to find our team and services'
              }
            </div>
            <p className="text-amber-500">
              {isRTL 
                ? 'استخدم شريط البحث في الأعلى للبدء'
                : 'Use the search bar above to get started'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;