// API utility functions for CMS integration

const CMS_BASE_URL = 'http://localhost:1337';

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface ImageData {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface HomePageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  background: ImageData;
  logo: ImageData;
}

export interface ApiResponse<T> {
  data: T;
  meta: Record<string, any>;
}

export interface HeroImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface HeroLocalization {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface HeroData {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: HeroImage[];
  localizations: HeroLocalization[];
}

export interface HeroesResponse {
  data: HeroData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface TeamMemberLocalization {
  id: number;
  documentId: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  phone: string;
  email: string;
}

export interface TeamMemberData {
  id: number;
  documentId: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  phone: string;
  email: string;
  image: HeroImage;
  localizations: TeamMemberLocalization[];
}

export interface TeamMembersResponse {
  data: TeamMemberData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ClientLocalization {
  id: number;
  documentId: string;
  name: string;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  company: string;
}

export interface ClientData {
  id: number;
  documentId: string;
  name: string;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  company: string;
  image: HeroImage[];
  localizations: ClientLocalization[];
}

export interface ClientsResponse {
  data: ClientData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Get the full URL for an image from the CMS
 */
export const getImageUrl = (imageUrl: string): string => {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `${CMS_BASE_URL}${imageUrl}`;
};

/**
 * Fetch home page data including background image and logo
 */
export const fetchHomePageData = async (): Promise<HomePageData | null> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/api/home-page?populate=*`, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch home page data:', response.status, response.statusText);
      return null;
    }

    const apiResponse: ApiResponse<HomePageData> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return null;
  }
};

/**
 * Get the best image format URL based on screen size preference
 */
export const getBestImageUrl = (image: ImageData, preferredFormat: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string => {
  if (image.formats && image.formats[preferredFormat]) {
    return getImageUrl(image.formats[preferredFormat]!.url);
  }
  
  // Fallback to original image
  return getImageUrl(image.url);
};

/**
 * Get the best hero image format URL based on screen size preference
 */
export const getBestHeroImageUrl = (image: HeroImage, preferredFormat: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string => {
  if (image.formats && image.formats[preferredFormat]) {
    return getImageUrl(image.formats[preferredFormat]!.url);
  }
  
  // Fallback to original image
  return getImageUrl(image.url);
};

/**
 * Fetch heroes data for carousel
 */
export const fetchHeroesData = async (locale: string = 'en'): Promise<HeroData[] | null> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/api/heroes?locale=${locale}&populate=*`, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch heroes data:', response.status, response.statusText);
      return null;
    }

    const apiResponse: HeroesResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching heroes data:', error);
    return null;
  }
};

/**
 * Fetch team members data
 */
export const fetchTeamMembersData = async (locale: string = 'en'): Promise<TeamMemberData[] | null> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/api/team-members?locale=${locale}&populate=*`, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch team members data:', response.status, response.statusText);
      return null;
    }

    const apiResponse: TeamMembersResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching team members data:', error);
    return null;
  }
};

/**
 * Fetch client testimonials data
 */
export const fetchClientsData = async (locale: string = 'en'): Promise<ClientData[] | null> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/api/clients?locale=${locale}&populate=*`, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch clients data:', response.status, response.statusText);
      return null;
    }

    const apiResponse: ClientsResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching clients data:', error);
    return null;
  }
};

// Subscription API types and functions
export interface SubscriptionData {
  email: string;
}

export interface SubscriptionRequest {
  data: SubscriptionData;
}

export interface SubscriptionResponse {
  data: {
    id: number;
    documentId: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, any>;
}

export interface SubscriptionError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, any>;
  };
}

// Service API types
export interface ServiceItem {
  id: number;
  heading: string;
  items?: ServiceItemDetail[];
}

export interface ServiceItemDetail {
  id: number;
  item: string;
}

export interface ServiceLocalization {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface ServiceData {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  services: ServiceItem[];
  localizations: ServiceLocalization[];
}

export interface ServicesResponse {
  data: ServiceData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Subscribe user to newsletter
 */
export const subscribeToNewsletter = async (email: string): Promise<SubscriptionResponse | SubscriptionError> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/api/subscribers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          email,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return result as SubscriptionError;
    }

    return result as SubscriptionResponse;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return {
      error: {
        status: 500,
        name: 'NetworkError',
        message: 'Failed to connect to the server',
      },
    };
  }
};

/**
 * Fetch services data
 */
export const fetchServicesData = async (locale: string = 'ar'): Promise<ServiceData[] | null> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/api/services?populate=*&locale=${locale}`, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch services data:', response.status, response.statusText);
      return null;
    }

    const apiResponse: ServicesResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching services data:', error);
    return null;
  }
};

/**
 * Fetch single service details by documentId
 */
export const fetchServiceDetails = async (documentId: string, locale: string = 'ar'): Promise<ServiceData | null> => {
  try {
    const response = await fetch(`${CMS_BASE_URL}/api/services/${documentId}?populate[services][populate]=*&locale=${locale}`, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch service details:', response.status, response.statusText);
      return null;
    }

    const apiResponse: { data: ServiceData; meta: Record<string, any> } = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching service details:', error);
    return null;
  }
};
