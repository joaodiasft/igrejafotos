export type GalleryStatus = 'publicada' | 'rascunho' | 'oculta';

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string; // YYYY-MM-DD or readable
  time?: string;
  coverPhoto: string;
  categoryId: string;
  categoryName: string;
  ministryId?: string;
  ministryName?: string;
  location?: string;
  watermarkEnabled: boolean;
  featured: boolean;
  status: GalleryStatus;
  photoCount: number;
  videoCount?: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  galleryId: string;
  originalUrl: string;
  webUrl: string;
  thumbnailUrl: string;
  filename: string;
  caption?: string;
  width: number;
  height: number;
  fileSize: number; // in bytes
  fileSizeFormatted?: string;
  sortOrder: number;
  downloads: number;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl: string;
  date: string;
  eventName: string;
  duration?: string;
  featured: boolean;
  createdAt: string;
}

export interface Ministry {
  id: string;
  name: string;
  slug: string;
  description: string;
  leader?: string;
  leaderRole?: string;
  image: string;
  meetingSchedule?: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  dayOfWeek: string;
  dayNumber: string;
  month: string;
  location: string;
  description: string;
  category: string;
  ministryId?: string;
  featured?: boolean;
}

export interface DownloadLog {
  id: string;
  photoId?: string;
  galleryId: string;
  galleryTitle: string;
  type: 'single' | 'multiple' | 'album';
  count: number;
  createdAt: string;
}

export interface SiteSettings {
  churchName: string;
  subtitle: string;
  churchSubtitle?: string;
  alternativeSubtitles?: string[];
  phone: string;
  whatsapp: string;
  instagram: string;
  youtube: string;
  email: string;
  address: string;
  neighborhood: string;
  city: string;
  cultSchedule: {
    day: string;
    time: string;
    title: string;
    description: string;
  }[];
  serviceSchedule?: {
    day: string;
    time: string;
    name: string;
  }[];
  defaultWatermarkText: string;
  watermarkText?: string;
  enableWatermarkDefault: boolean;
  watermarkEnabled?: boolean;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'center';
  heroImageUrl: string;
  historyText: string;
  missionText: string;
  visionText: string;
  valuesText: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'editor';
}
