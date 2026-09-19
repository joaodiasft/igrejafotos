import { 
  Gallery, 
  Photo, 
  VideoItem, 
  Ministry, 
  Category, 
  ChurchEvent, 
  SiteSettings, 
  DownloadLog,
  AdminUser
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_MINISTRIES, 
  INITIAL_GALLERIES, 
  INITIAL_VIDEOS, 
  INITIAL_AGENDA_EVENTS,
  INITIAL_DOWNLOAD_LOGS,
  generateInitialPhotos 
} from './mockData';

const STORAGE_KEYS = {
  SETTINGS: 'ad_barravento_settings_v1',
  GALLERIES: 'ad_barravento_galleries_v1',
  PHOTOS: 'ad_barravento_photos_v1',
  VIDEOS: 'ad_barravento_videos_v1',
  MINISTRIES: 'ad_barravento_ministries_v1',
  CATEGORIES: 'ad_barravento_categories_v1',
  EVENTS: 'ad_barravento_events_v1',
  DOWNLOADS: 'ad_barravento_downloads_v1',
  ADMIN_USER: 'ad_barravento_admin_user_v1'
};

class DatabaseService {
  private settings: SiteSettings;
  private galleries: Gallery[];
  private photos: Photo[];
  private videos: VideoItem[];
  private ministries: Ministry[];
  private categories: Category[];
  private events: ChurchEvent[];
  private downloads: DownloadLog[];
  private adminUser: AdminUser | null;

  constructor() {
    this.settings = this.loadFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    this.galleries = this.loadFromStorage(STORAGE_KEYS.GALLERIES, INITIAL_GALLERIES);
    this.photos = this.loadFromStorage(STORAGE_KEYS.PHOTOS, generateInitialPhotos());
    this.videos = this.loadFromStorage(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    this.ministries = this.loadFromStorage(STORAGE_KEYS.MINISTRIES, INITIAL_MINISTRIES);
    this.categories = this.loadFromStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    this.events = this.loadFromStorage(STORAGE_KEYS.EVENTS, INITIAL_AGENDA_EVENTS);
    this.downloads = this.loadFromStorage(STORAGE_KEYS.DOWNLOADS, INITIAL_DOWNLOAD_LOGS);
    this.adminUser = this.loadFromStorage(STORAGE_KEYS.ADMIN_USER, null);
  }

  private loadFromStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback if local storage is disabled or quota exceeded
    }
    return fallback;
  }

  private saveToStorage<T>(key: string, data: T) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      console.warn(`Could not save ${key} to localStorage quota`);
    }
  }

  // --- SETTINGS ---
  getSettings(): SiteSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    return this.settings;
  }

  // --- GALLERIES ---
  getGalleries(options?: { onlyPublished?: boolean; categoryId?: string; ministryId?: string; search?: string }): Gallery[] {
    let result = [...this.galleries];
    if (options?.onlyPublished) {
      result = result.filter(g => g.status === 'publicada');
    }
    if (options?.categoryId && options.categoryId !== 'cat-todos') {
      result = result.filter(g => g.categoryId === options.categoryId);
    }
    if (options?.ministryId) {
      result = result.filter(g => g.ministryId === options.ministryId);
    }
    if (options?.search) {
      const term = options.search.toLowerCase().trim();
      result = result.filter(g => 
        g.title.toLowerCase().includes(term) ||
        g.description.toLowerCase().includes(term) ||
        g.categoryName.toLowerCase().includes(term) ||
        (g.ministryName && g.ministryName.toLowerCase().includes(term)) ||
        g.date.includes(term)
      );
    }

    // Sort by date descending
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getGalleryById(id: string): Gallery | undefined {
    return this.galleries.find(g => g.id === id);
  }

  getGalleryBySlug(slug: string): Gallery | undefined {
    return this.galleries.find(g => g.slug === slug || g.id === slug);
  }

  getLatestServiceGallery(): Gallery | undefined {
    const published = this.galleries.filter(g => g.status === 'publicada');
    return published[0];
  }

  createGallery(data: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt' | 'photoCount'>): Gallery {
    const id = `gal-${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newGallery: Gallery = {
      ...data,
      id,
      slug,
      photoCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.galleries.unshift(newGallery);
    this.saveToStorage(STORAGE_KEYS.GALLERIES, this.galleries);
    return newGallery;
  }

  updateGallery(id: string, updates: Partial<Gallery>): Gallery | undefined {
    const index = this.galleries.findIndex(g => g.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...this.galleries[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.galleries[index] = updated;
    this.saveToStorage(STORAGE_KEYS.GALLERIES, this.galleries);
    return updated;
  }

  deleteGallery(id: string): boolean {
    this.galleries = this.galleries.filter(g => g.id !== id);
    this.photos = this.photos.filter(p => p.galleryId !== id);
    this.saveToStorage(STORAGE_KEYS.GALLERIES, this.galleries);
    this.saveToStorage(STORAGE_KEYS.PHOTOS, this.photos);
    return true;
  }

  // --- PHOTOS ---
  getPhotosByGallery(galleryId: string): Photo[] {
    return this.photos
      .filter(p => p.galleryId === galleryId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getPhotoById(photoId: string): Photo | undefined {
    return this.photos.find(p => p.id === photoId);
  }

  addPhotos(galleryId: string, newPhotos: Array<Omit<Photo, 'id' | 'galleryId' | 'sortOrder' | 'downloads' | 'createdAt'>>): Photo[] {
    const existingPhotos = this.getPhotosByGallery(galleryId);
    let currentMaxOrder = existingPhotos.reduce((max, p) => Math.max(max, p.sortOrder), 0);

    const added: Photo[] = newPhotos.map((p, idx) => {
      currentMaxOrder++;
      return {
        ...p,
        id: `photo-${galleryId}-${Date.now()}-${idx}`,
        galleryId,
        sortOrder: currentMaxOrder,
        downloads: 0,
        createdAt: new Date().toISOString()
      };
    });

    this.photos.push(...added);
    this.saveToStorage(STORAGE_KEYS.PHOTOS, this.photos);

    // Update gallery photoCount and cover if none
    const gallery = this.getGalleryById(galleryId);
    if (gallery) {
      const allPhotos = this.getPhotosByGallery(galleryId);
      const updates: Partial<Gallery> = {
        photoCount: allPhotos.length
      };
      if (!gallery.coverPhoto && added.length > 0) {
        updates.coverPhoto = added[0].webUrl;
      }
      this.updateGallery(galleryId, updates);
    }

    return added;
  }

  reorderPhotos(galleryId: string, photoIdsInOrder: string[]) {
    photoIdsInOrder.forEach((id, idx) => {
      const photo = this.photos.find(p => p.id === id);
      if (photo) {
        photo.sortOrder = idx + 1;
      }
    });
    this.saveToStorage(STORAGE_KEYS.PHOTOS, this.photos);
  }

  deletePhoto(photoId: string): boolean {
    const photo = this.getPhotoById(photoId);
    if (!photo) return false;
    const galleryId = photo.galleryId;
    this.photos = this.photos.filter(p => p.id !== photoId);
    this.saveToStorage(STORAGE_KEYS.PHOTOS, this.photos);

    // Update gallery count
    const remaining = this.getPhotosByGallery(galleryId);
    this.updateGallery(galleryId, { photoCount: remaining.length });
    return true;
  }

  deleteMultiplePhotos(photoIds: string[]): boolean {
    const set = new Set(photoIds);
    const affectedGalleries = new Set<string>();
    this.photos.forEach(p => {
      if (set.has(p.id)) {
        affectedGalleries.add(p.galleryId);
      }
    });

    this.photos = this.photos.filter(p => !set.has(p.id));
    this.saveToStorage(STORAGE_KEYS.PHOTOS, this.photos);

    affectedGalleries.forEach(gid => {
      const remaining = this.getPhotosByGallery(gid);
      this.updateGallery(gid, { photoCount: remaining.length });
    });
    return true;
  }

  movePhotosToGallery(photoIds: string[], targetGalleryId: string) {
    const set = new Set(photoIds);
    this.photos.forEach(p => {
      if (set.has(p.id)) {
        p.galleryId = targetGalleryId;
      }
    });
    this.saveToStorage(STORAGE_KEYS.PHOTOS, this.photos);
    // Refresh counts
    this.galleries.forEach(g => {
      const count = this.photos.filter(p => p.galleryId === g.id).length;
      g.photoCount = count;
    });
    this.saveToStorage(STORAGE_KEYS.GALLERIES, this.galleries);
  }

  // --- VIDEOS ---
  getVideos(onlyFeatured?: boolean): VideoItem[] {
    if (onlyFeatured) {
      return this.videos.filter(v => v.featured);
    }
    return [...this.videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addVideo(data: Omit<VideoItem, 'id' | 'createdAt'>): VideoItem {
    const id = `vid-${Date.now()}`;
    const newVideo: VideoItem = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };
    this.videos.unshift(newVideo);
    this.saveToStorage(STORAGE_KEYS.VIDEOS, this.videos);
    return newVideo;
  }

  deleteVideo(id: string): boolean {
    this.videos = this.videos.filter(v => v.id !== id);
    this.saveToStorage(STORAGE_KEYS.VIDEOS, this.videos);
    return true;
  }

  // --- MINISTRIES ---
  getMinistries(): Ministry[] {
    return [...this.ministries].sort((a, b) => a.order - b.order);
  }

  getMinistryBySlug(slug: string): Ministry | undefined {
    return this.ministries.find(m => m.slug === slug || m.id === slug);
  }

  addMinistry(data: Omit<Ministry, 'id' | 'order'>): Ministry {
    const id = `min-${Date.now()}`;
    const newMinistry: Ministry = {
      ...data,
      id,
      order: this.ministries.length + 1
    };
    this.ministries.push(newMinistry);
    this.saveToStorage(STORAGE_KEYS.MINISTRIES, this.ministries);
    return newMinistry;
  }

  updateMinistry(id: string, updates: Partial<Ministry>): Ministry | undefined {
    const idx = this.ministries.findIndex(m => m.id === id);
    if (idx === -1) return undefined;
    this.ministries[idx] = { ...this.ministries[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.MINISTRIES, this.ministries);
    return this.ministries[idx];
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    return [...this.categories];
  }

  addCategory(name: string): Category {
    const id = `cat-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = { id, name, slug, color: 'blue' };
    this.categories.push(newCategory);
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
    return newCategory;
  }

  deleteCategory(id: string): boolean {
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
    return true;
  }

  // Aliases for convenient usage across admin and app
  saveSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    return this.updateSettings(newSettings);
  }

  createEvent(event: Omit<ChurchEvent, 'id'>): ChurchEvent {
    return this.addEvent(event);
  }

  updateEvent(id: string, updates: Partial<ChurchEvent>): ChurchEvent | undefined {
    const idx = this.events.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    this.events[idx] = { ...this.events[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.EVENTS, this.events);
    return this.events[idx];
  }

  addPhoto(photo: Omit<Photo, 'id' | 'sortOrder' | 'downloads' | 'createdAt'>): Photo {
    const existingPhotos = this.getPhotosByGallery(photo.galleryId);
    const maxOrder = existingPhotos.reduce((max, p) => Math.max(max, p.sortOrder), 0);
    const newP: Photo = {
      ...photo,
      id: `photo-${photo.galleryId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sortOrder: maxOrder + 1,
      downloads: 0,
      createdAt: new Date().toISOString()
    };
    this.photos.push(newP);
    this.saveToStorage(STORAGE_KEYS.PHOTOS, this.photos);

    const gal = this.getGalleryById(photo.galleryId);
    if (gal) {
      const allPhotos = this.getPhotosByGallery(photo.galleryId);
      this.updateGallery(photo.galleryId, {
        photoCount: allPhotos.length,
        coverPhoto: gal.coverPhoto || photo.webUrl
      });
    }
    return newP;
  }

  // --- EVENTS / AGENDA ---
  getEvents(): ChurchEvent[] {
    return [...this.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  addEvent(event: Omit<ChurchEvent, 'id'>): ChurchEvent {
    const id = `ev-${Date.now()}`;
    const newEvent: ChurchEvent = { ...event, id };
    this.events.push(newEvent);
    this.saveToStorage(STORAGE_KEYS.EVENTS, this.events);
    return newEvent;
  }

  deleteEvent(id: string): boolean {
    this.events = this.events.filter(e => e.id !== id);
    this.saveToStorage(STORAGE_KEYS.EVENTS, this.events);
    return true;
  }

  // --- DOWNLOAD LOGGING & METRICS ---
  logDownload(galleryId: string, type: 'single' | 'multiple' | 'album', count: number, photoId?: string) {
    const gallery = this.getGalleryById(galleryId);
    const newLog: DownloadLog = {
      id: `dl-${Date.now()}`,
      galleryId,
      photoId,
      galleryTitle: gallery?.title || 'Galeria AD Barravento',
      type,
      count,
      createdAt: new Date().toISOString()
    };
    this.downloads.unshift(newLog);
    if (this.downloads.length > 50) this.downloads.pop();
    this.saveToStorage(STORAGE_KEYS.DOWNLOADS, this.downloads);

    // Update photo download count if single
    if (photoId) {
      const p = this.getPhotoById(photoId);
      if (p) {
        p.downloads = (p.downloads || 0) + 1;
        this.saveToStorage(STORAGE_KEYS.PHOTOS, this.photos);
      }
    }
  }

  getDownloadLogs(): DownloadLog[] {
    return [...this.downloads];
  }

  getDashboardMetrics() {
    const totalGalleries = this.galleries.length;
    const totalPhotos = this.photos.length;
    const totalVideos = this.videos.length;
    const totalDownloads = this.downloads.reduce((acc, curr) => acc + curr.count, 12741);
    const totalUpcomingEvents = this.events.length;

    // Most downloaded galleries
    const galleryCounts: Record<string, { title: string; count: number }> = {};
    this.downloads.forEach(d => {
      if (!galleryCounts[d.galleryId]) {
        galleryCounts[d.galleryId] = { title: d.galleryTitle, count: 0 };
      }
      galleryCounts[d.galleryId].count += d.count;
    });

    const topGalleries = Object.entries(galleryCounts)
      .map(([id, data]) => ({ id, title: data.title, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalGalleries,
      totalPhotos,
      totalVideos,
      totalDownloads,
      totalUpcomingEvents,
      topGalleries
    };
  }

  // --- ADMIN AUTH ---
  getAdminUser(): AdminUser | null {
    return this.adminUser;
  }

  loginAdmin(email: string): AdminUser {
    const user: AdminUser = {
      email,
      name: 'Administrador AD Barravento',
      role: 'admin'
    };
    this.adminUser = user;
    this.saveToStorage(STORAGE_KEYS.ADMIN_USER, user);
    return user;
  }

  logoutAdmin() {
    this.adminUser = null;
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  }

  // Reset database back to sample initial state
  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.GALLERIES);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.MINISTRIES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.DOWNLOADS);
    this.settings = INITIAL_SETTINGS;
    this.galleries = INITIAL_GALLERIES;
    this.photos = generateInitialPhotos();
    this.videos = INITIAL_VIDEOS;
    this.ministries = INITIAL_MINISTRIES;
    this.categories = INITIAL_CATEGORIES;
    this.events = INITIAL_AGENDA_EVENTS;
    this.downloads = INITIAL_DOWNLOAD_LOGS;
  }
}

export const db = new DatabaseService();
export { db as DatabaseService };
