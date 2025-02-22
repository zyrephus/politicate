export interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  image?: string;
  displayLink: string;
  pagemap?: {
    metatags?: Array<{
      'og:image'?: string;
    }>;
  };
} 