import JSZip from 'jszip';
import { Photo } from '../types';
import { db } from '../services/db';

/**
 * Downloads a single photo in its original quality without watermark
 */
export async function downloadSinglePhoto(photo: Photo, galleryTitle: string): Promise<void> {
  try {
    const filename = photo.filename || `AD_Barravento_${photo.id}.jpg`;
    
    // Fetch original image as blob to force native file download rather than opening in tab
    const response = await fetch(photo.originalUrl);
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Register download in database
    await db.logDownload(photo.galleryId, 'single', 1, photo.id);
  } catch (err) {
    console.warn('Direct blob download failed, falling back to direct link', err);
    const a = document.createElement('a');
    a.href = photo.originalUrl;
    a.download = photo.filename;
    a.target = '_blank';
    a.click();
    await db.logDownload(photo.galleryId, 'single', 1, photo.id);
  }
}

/**
 * Downloads multiple selected photos packed into a ZIP file
 */
export async function downloadPhotosAsZip(
  photos: Photo[], 
  zipName: string, 
  galleryId: string,
  onProgress?: (percent: number, current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(zipName) || zip;
  const total = photos.length;

  for (let i = 0; i < total; i++) {
    const photo = photos[i];
    try {
      // Fetch photo as blob
      const res = await fetch(photo.originalUrl);
      const blob = await res.blob();
      const filename = photo.filename || `foto_${String(i + 1).padStart(3, '0')}.jpg`;
      folder.file(filename, blob);
    } catch {
      console.warn(`Failed to fetch photo ${photo.id} for zip`);
    }

    if (onProgress) {
      const pct = Math.round(((i + 1) / total) * 90);
      onProgress(pct, i + 1, total);
    }
  }

  // Generate zip file
  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'STORE' // Faster on mobile browsers
  }, (metadata) => {
    if (onProgress) {
      const overall = 90 + Math.round((metadata.percent / 100) * 10);
      onProgress(Math.min(overall, 100), total, total);
    }
  });

  // Trigger download
  const url = window.URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${zipName}.zip`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  // Log in db
  await db.logDownload(galleryId, 'multiple', total);
}

/**
 * Share URL or open WhatsApp
 */
export function shareGalleryWhatsApp(title: string, dateFormatted: string, churchName: string) {
  const currentUrl = window.location.href;
  const text = `Confira as fotos de *${title}* (${dateFormatted}) na *${churchName}*!\n\nVeja a galeria completa e baixe suas fotos gratuitas em alta resolução pelo celular no link abaixo:\n${currentUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
}
