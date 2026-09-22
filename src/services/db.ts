import {
  Gallery,
  Photo,
  VideoItem,
  Ministry,
  Category,
  ChurchEvent,
  SiteSettings,
} from '../types';
import { MEDIA_BUCKET, supabase } from '../lib/supabase';

const FALLBACK_SETTINGS: SiteSettings = {
  churchName: 'AD BARRAVENTO',
  subtitle: 'Vivendo, registrando e compartilhando momentos de fé.',
  phone: '',
  whatsapp: '',
  instagram: '',
  youtube: '',
  email: '',
  address: '',
  neighborhood: '',
  city: '',
  cultSchedule: [],
  defaultWatermarkText: 'AD BARRAVENTO',
  enableWatermarkDefault: true,
  heroImageUrl: '',
  historyText: '',
  missionText: '',
  visionText: '',
  valuesText: '',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function mapGallery(row: Record<string, unknown>, photoCount = 0): Gallery {
  const category = row.fotosculto_categories as { name?: string } | null;
  const ministry = row.fotosculto_ministries as { name?: string } | null;
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: String(row.description ?? ''),
    date: String(row.event_date),
    time: row.event_time ? String(row.event_time) : undefined,
    coverPhoto: String(row.cover_photo ?? ''),
    categoryId: row.category_id ? String(row.category_id) : '',
    categoryName: category?.name || '',
    ministryId: row.ministry_id ? String(row.ministry_id) : undefined,
    ministryName: ministry?.name,
    location: row.location ? String(row.location) : undefined,
    watermarkEnabled: Boolean(row.watermark_enabled),
    featured: Boolean(row.featured),
    status: (row.status as Gallery['status']) || 'publicada',
    photoCount,
    publishedAt: String(row.published_at ?? row.created_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapPhoto(row: Record<string, unknown>): Photo {
  return {
    id: String(row.id),
    galleryId: String(row.gallery_id),
    originalUrl: String(row.original_url),
    webUrl: String(row.web_url),
    thumbnailUrl: String(row.thumbnail_url),
    filename: String(row.filename),
    caption: row.caption ? String(row.caption) : undefined,
    width: Number(row.width ?? 1920),
    height: Number(row.height ?? 1080),
    fileSize: Number(row.file_size ?? 0),
    sortOrder: Number(row.sort_order ?? 0),
    downloads: Number(row.downloads ?? 0),
    createdAt: String(row.created_at),
  };
}

async function photoCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('fotosculto_photos').select('gallery_id');
  if (error || !data) return {};
  return data.reduce<Record<string, number>>((acc, row) => {
    const id = String(row.gallery_id);
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
}

export const DatabaseService = {
  async getSettings(): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('fotosculto_settings')
      .select('payload')
      .eq('id', 'site')
      .maybeSingle();
    if (error || !data?.payload) return FALLBACK_SETTINGS;
    return { ...FALLBACK_SETTINGS, ...(data.payload as SiteSettings) };
  },

  async saveSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const payload = { ...current, ...updates };
    const { error } = await supabase
      .from('fotosculto_settings')
      .upsert({ id: 'site', payload, updated_at: new Date().toISOString() });
    if (error) throw error;
    return payload;
  },

  async getGalleries(): Promise<Gallery[]> {
    const [{ data, error }, counts] = await Promise.all([
      supabase
        .from('fotosculto_galleries')
        .select('*, fotosculto_categories(name), fotosculto_ministries(name)')
        .order('event_date', { ascending: false }),
      photoCounts(),
    ]);
    if (error) throw error;
    return (data || []).map((row) => mapGallery(row, counts[String(row.id)] || 0));
  },

  async getPhotosByGallery(galleryId: string): Promise<Photo[]> {
    const { data, error } = await supabase
      .from('fotosculto_photos')
      .select('*')
      .eq('gallery_id', galleryId)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapPhoto);
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('fotosculto_categories')
      .select('*')
      .order('name');
    if (error) throw error;
    const rows = (data || []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      color: row.color || 'gold',
    }));
    return [{ id: 'cat-todos', name: 'Todos', slug: 'todos', color: 'stone' }, ...rows];
  },

  async getMinistries(): Promise<Ministry[]> {
    const { data, error } = await supabase
      .from('fotosculto_ministries')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return (data || []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      description: String(row.description ?? ''),
      leader: row.leader || undefined,
      leaderRole: row.leader_role || undefined,
      image: String(row.image ?? ''),
      meetingSchedule: row.meeting_schedule || undefined,
      order: Number(row.sort_order ?? 0),
    }));
  },

  async getEvents(): Promise<ChurchEvent[]> {
    const { data, error } = await supabase
      .from('fotosculto_events')
      .select('*')
      .order('event_date', { ascending: true });
    if (error) throw error;
    return (data || []).map((row) => ({
      id: String(row.id),
      title: String(row.title),
      date: String(row.event_date),
      time: String(row.event_time),
      dayOfWeek: String(row.day_of_week),
      dayNumber: String(row.day_number),
      month: String(row.month_label),
      location: String(row.location),
      description: String(row.description ?? ''),
      category: String(row.category),
      ministryId: row.ministry_id ? String(row.ministry_id) : undefined,
      featured: Boolean(row.featured),
    }));
  },

  async getVideos(): Promise<VideoItem[]> {
    const { data, error } = await supabase
      .from('fotosculto_videos')
      .select('*')
      .order('event_date', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => ({
      id: String(row.id),
      title: String(row.title),
      description: String(row.description ?? ''),
      youtubeUrl: String(row.youtube_url),
      youtubeId: String(row.youtube_id),
      thumbnailUrl: String(row.thumbnail_url),
      date: String(row.event_date),
      eventName: String(row.event_name),
      duration: row.duration || undefined,
      featured: Boolean(row.featured),
      createdAt: String(row.created_at),
    }));
  },

  async createGallery(input: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt' | 'photoCount'>): Promise<Gallery> {
    const { data, error } = await supabase
      .from('fotosculto_galleries')
      .insert({
        title: input.title,
        slug: input.slug || slugify(input.title),
        description: input.description,
        event_date: input.date,
        event_time: input.time,
        cover_photo: input.coverPhoto,
        category_id: input.categoryId || null,
        ministry_id: input.ministryId || null,
        location: input.location,
        watermark_enabled: input.watermarkEnabled,
        featured: input.featured,
        status: input.status,
        published_at: input.publishedAt,
      })
      .select('*, fotosculto_categories(name), fotosculto_ministries(name)')
      .single();
    if (error) throw error;
    return mapGallery(data, 0);
  },

  async updateGallery(id: string, updates: Partial<Gallery>): Promise<Gallery | undefined> {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.date !== undefined) patch.event_date = updates.date;
    if (updates.time !== undefined) patch.event_time = updates.time;
    if (updates.coverPhoto !== undefined) patch.cover_photo = updates.coverPhoto;
    if (updates.categoryId !== undefined) patch.category_id = updates.categoryId || null;
    if (updates.ministryId !== undefined) patch.ministry_id = updates.ministryId || null;
    if (updates.location !== undefined) patch.location = updates.location;
    if (updates.watermarkEnabled !== undefined) patch.watermark_enabled = updates.watermarkEnabled;
    if (updates.featured !== undefined) patch.featured = updates.featured;
    if (updates.status !== undefined) patch.status = updates.status;

    const { data, error } = await supabase
      .from('fotosculto_galleries')
      .update(patch)
      .eq('id', id)
      .select('*, fotosculto_categories(name), fotosculto_ministries(name)')
      .single();
    if (error) throw error;
    const counts = await photoCounts();
    return mapGallery(data, counts[id] || 0);
  },

  async deleteGallery(id: string): Promise<boolean> {
    const photos = await this.getPhotosByGallery(id);
    const paths = photos
      .map((photo) => {
        const marker = `/object/public/${MEDIA_BUCKET}/`;
        const idx = photo.originalUrl.indexOf(marker);
        return idx >= 0 ? photo.originalUrl.slice(idx + marker.length) : null;
      })
      .filter((path): path is string => Boolean(path));
    if (paths.length) {
      await supabase.storage.from(MEDIA_BUCKET).remove(paths);
    }
    const { error } = await supabase.from('fotosculto_galleries').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async addPhoto(photo: Omit<Photo, 'id' | 'sortOrder' | 'downloads' | 'createdAt'> & { storagePath?: string }): Promise<Photo> {
    const existing = await this.getPhotosByGallery(photo.galleryId);
    const { data, error } = await supabase
      .from('fotosculto_photos')
      .insert({
        gallery_id: photo.galleryId,
        original_url: photo.originalUrl,
        web_url: photo.webUrl,
        thumbnail_url: photo.thumbnailUrl,
        storage_path: photo.storagePath,
        filename: photo.filename,
        width: photo.width,
        height: photo.height,
        file_size: photo.fileSize,
        sort_order: existing.length + 1,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapPhoto(data);
  },

  async uploadPhotos(galleryId: string, files: File[]): Promise<Photo[]> {
    const uploaded: Photo[] = [];
    for (const file of files) {
      const safeName = file.name.replace(/[^\w.\-]+/g, '-');
      const path = `${galleryId}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg',
      });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      const url = publicData.publicUrl;
      uploaded.push(
        await this.addPhoto({
          galleryId,
          originalUrl: url,
          webUrl: url,
          thumbnailUrl: url,
          filename: file.name,
          fileSize: file.size,
          width: 1920,
          height: 1080,
          storagePath: path,
        })
      );
    }
    const gallery = (await this.getGalleries()).find((item) => item.id === galleryId);
    if (gallery && !gallery.coverPhoto && uploaded[0]) {
      await this.updateGallery(galleryId, { coverPhoto: uploaded[0].webUrl });
    }
    return uploaded;
  },

  async deletePhoto(photoId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('fotosculto_photos')
      .select('*')
      .eq('id', photoId)
      .maybeSingle();
    if (error) throw error;
    if (data?.storage_path) {
      await supabase.storage.from(MEDIA_BUCKET).remove([String(data.storage_path)]);
    }
    const { error: delError } = await supabase.from('fotosculto_photos').delete().eq('id', photoId);
    if (delError) throw delError;
    return true;
  },

  async addVideo(input: Omit<VideoItem, 'id' | 'createdAt'>): Promise<VideoItem> {
    const { data, error } = await supabase
      .from('fotosculto_videos')
      .insert({
        title: input.title,
        description: input.description,
        youtube_url: input.youtubeUrl,
        youtube_id: input.youtubeId,
        thumbnail_url: input.thumbnailUrl,
        event_date: input.date,
        event_name: input.eventName,
        duration: input.duration,
        featured: input.featured,
      })
      .select('*')
      .single();
    if (error) throw error;
    const videos = await this.getVideos();
    return videos.find((item) => item.id === data.id)!;
  },

  async deleteVideo(id: string): Promise<boolean> {
    const { error } = await supabase.from('fotosculto_videos').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async addCategory(name: string): Promise<Category> {
    const { data, error } = await supabase
      .from('fotosculto_categories')
      .insert({ name, slug: slugify(name), color: 'gold' })
      .select('*')
      .single();
    if (error) throw error;
    return { id: data.id, name: data.name, slug: data.slug, color: data.color };
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (id === 'cat-todos') return false;
    const { error } = await supabase.from('fotosculto_categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async createEvent(event: Omit<ChurchEvent, 'id'>): Promise<ChurchEvent> {
    const { data, error } = await supabase
      .from('fotosculto_events')
      .insert({
        title: event.title,
        event_date: event.date,
        event_time: event.time,
        day_of_week: event.dayOfWeek,
        day_number: event.dayNumber,
        month_label: event.month,
        location: event.location,
        description: event.description,
        category: event.category,
        ministry_id: event.ministryId || null,
        featured: event.featured || false,
      })
      .select('*')
      .single();
    if (error) throw error;
    const events = await this.getEvents();
    return events.find((item) => item.id === data.id)!;
  },

  async updateEvent(id: string, updates: Partial<ChurchEvent>): Promise<ChurchEvent | undefined> {
    const patch: Record<string, unknown> = {};
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.date !== undefined) patch.event_date = updates.date;
    if (updates.time !== undefined) patch.event_time = updates.time;
    if (updates.dayOfWeek !== undefined) patch.day_of_week = updates.dayOfWeek;
    if (updates.dayNumber !== undefined) patch.day_number = updates.dayNumber;
    if (updates.month !== undefined) patch.month_label = updates.month;
    if (updates.location !== undefined) patch.location = updates.location;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.category !== undefined) patch.category = updates.category;
    if (updates.featured !== undefined) patch.featured = updates.featured;
    const { error } = await supabase.from('fotosculto_events').update(patch).eq('id', id);
    if (error) throw error;
    const events = await this.getEvents();
    return events.find((item) => item.id === id);
  },

  async deleteEvent(id: string): Promise<boolean> {
    const { error } = await supabase.from('fotosculto_events').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async logDownload(galleryId: string, type: 'single' | 'multiple' | 'album', count: number, photoId?: string) {
    const galleries = await this.getGalleries();
    const gallery = galleries.find((item) => item.id === galleryId);
    await supabase.from('fotosculto_download_logs').insert({
      photo_id: photoId || null,
      gallery_id: galleryId,
      gallery_title: gallery?.title || 'Galeria AD Barravento',
      download_type: type,
      count,
    });
  },

  async loginAdmin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: staff, error: staffError } = await supabase
      .from('fotosculto_staff')
      .select('user_id, role, display_name')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (staffError || !staff) {
      await supabase.auth.signOut();
      throw new Error('Este usuário não pertence à equipe do Fotosculto.');
    }
    return staff;
  },

  async logoutAdmin() {
    await supabase.auth.signOut();
  },

  async getSessionStaff() {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return null;
    const { data: staff } = await supabase
      .from('fotosculto_staff')
      .select('user_id, role, display_name')
      .eq('user_id', data.session.user.id)
      .maybeSingle();
    return staff;
  },
};

export const db = DatabaseService;
