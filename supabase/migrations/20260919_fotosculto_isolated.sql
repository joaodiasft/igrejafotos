-- Isolated Fotosculto namespace inside the shared Supabase project.
-- Does not touch school/RNM tables, functions, or existing storage buckets.

CREATE SCHEMA IF NOT EXISTS fotosculto_private;
REVOKE ALL ON SCHEMA fotosculto_private FROM PUBLIC;
GRANT USAGE ON SCHEMA fotosculto_private TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.fotosculto_staff (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fotosculto_settings (
  id text PRIMARY KEY DEFAULT 'site',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fotosculto_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  color text DEFAULT 'gold',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fotosculto_ministries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  leader text,
  leader_role text,
  image text,
  meeting_schedule text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fotosculto_galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  event_date date NOT NULL,
  event_time text,
  cover_photo text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.fotosculto_categories(id) ON DELETE SET NULL,
  ministry_id uuid REFERENCES public.fotosculto_ministries(id) ON DELETE SET NULL,
  location text DEFAULT 'Templo Sede',
  watermark_enabled boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'publicada' CHECK (status IN ('publicada', 'rascunho', 'oculta')),
  published_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fotosculto_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.fotosculto_galleries(id) ON DELETE CASCADE,
  original_url text NOT NULL,
  web_url text NOT NULL,
  thumbnail_url text NOT NULL,
  storage_path text,
  filename text NOT NULL,
  caption text,
  width integer NOT NULL DEFAULT 1920,
  height integer NOT NULL DEFAULT 1080,
  file_size integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  downloads integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fotosculto_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  youtube_url text NOT NULL,
  youtube_id text NOT NULL,
  thumbnail_url text NOT NULL,
  event_date date NOT NULL DEFAULT CURRENT_DATE,
  event_name text NOT NULL DEFAULT 'Culto',
  duration text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fotosculto_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date date NOT NULL,
  event_time text NOT NULL DEFAULT '19:00',
  day_of_week text NOT NULL DEFAULT '',
  day_number text NOT NULL DEFAULT '',
  month_label text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT 'Templo Sede',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Cultos',
  ministry_id uuid REFERENCES public.fotosculto_ministries(id) ON DELETE SET NULL,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fotosculto_download_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid REFERENCES public.fotosculto_photos(id) ON DELETE SET NULL,
  gallery_id uuid REFERENCES public.fotosculto_galleries(id) ON DELETE SET NULL,
  gallery_title text NOT NULL DEFAULT '',
  download_type text NOT NULL CHECK (download_type IN ('single', 'multiple', 'album')),
  count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fotosculto_photos_gallery_idx ON public.fotosculto_photos (gallery_id, sort_order);
CREATE INDEX IF NOT EXISTS fotosculto_galleries_date_idx ON public.fotosculto_galleries (event_date DESC);
CREATE INDEX IF NOT EXISTS fotosculto_events_date_idx ON public.fotosculto_events (event_date);

CREATE OR REPLACE FUNCTION fotosculto_private.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'fotosculto_role') IN ('admin', 'editor'),
    false
  ) OR EXISTS (
    SELECT 1 FROM public.fotosculto_staff s WHERE s.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION fotosculto_private.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION fotosculto_private.is_staff() TO anon, authenticated, service_role;

ALTER TABLE public.fotosculto_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotosculto_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotosculto_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotosculto_ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotosculto_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotosculto_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotosculto_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotosculto_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotosculto_download_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fotosculto_staff_select ON public.fotosculto_staff;
CREATE POLICY fotosculto_staff_select ON public.fotosculto_staff
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_staff_write ON public.fotosculto_staff;
CREATE POLICY fotosculto_staff_write ON public.fotosculto_staff
  FOR ALL TO authenticated
  USING (fotosculto_private.is_staff())
  WITH CHECK (fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_settings_read ON public.fotosculto_settings;
CREATE POLICY fotosculto_settings_read ON public.fotosculto_settings
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS fotosculto_settings_write ON public.fotosculto_settings;
CREATE POLICY fotosculto_settings_write ON public.fotosculto_settings
  FOR ALL TO authenticated
  USING (fotosculto_private.is_staff())
  WITH CHECK (fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_categories_read ON public.fotosculto_categories;
CREATE POLICY fotosculto_categories_read ON public.fotosculto_categories
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS fotosculto_categories_write ON public.fotosculto_categories;
CREATE POLICY fotosculto_categories_write ON public.fotosculto_categories
  FOR ALL TO authenticated
  USING (fotosculto_private.is_staff())
  WITH CHECK (fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_ministries_read ON public.fotosculto_ministries;
CREATE POLICY fotosculto_ministries_read ON public.fotosculto_ministries
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS fotosculto_ministries_write ON public.fotosculto_ministries;
CREATE POLICY fotosculto_ministries_write ON public.fotosculto_ministries
  FOR ALL TO authenticated
  USING (fotosculto_private.is_staff())
  WITH CHECK (fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_galleries_read ON public.fotosculto_galleries;
CREATE POLICY fotosculto_galleries_read ON public.fotosculto_galleries
  FOR SELECT TO anon, authenticated
  USING (status = 'publicada' OR fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_galleries_write ON public.fotosculto_galleries;
CREATE POLICY fotosculto_galleries_write ON public.fotosculto_galleries
  FOR ALL TO authenticated
  USING (fotosculto_private.is_staff())
  WITH CHECK (fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_photos_read ON public.fotosculto_photos;
CREATE POLICY fotosculto_photos_read ON public.fotosculto_photos
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.fotosculto_galleries g
      WHERE g.id = gallery_id
        AND (g.status = 'publicada' OR fotosculto_private.is_staff())
    )
  );

DROP POLICY IF EXISTS fotosculto_photos_write ON public.fotosculto_photos;
CREATE POLICY fotosculto_photos_write ON public.fotosculto_photos
  FOR ALL TO authenticated
  USING (fotosculto_private.is_staff())
  WITH CHECK (fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_videos_read ON public.fotosculto_videos;
CREATE POLICY fotosculto_videos_read ON public.fotosculto_videos
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS fotosculto_videos_write ON public.fotosculto_videos;
CREATE POLICY fotosculto_videos_write ON public.fotosculto_videos
  FOR ALL TO authenticated
  USING (fotosculto_private.is_staff())
  WITH CHECK (fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_events_read ON public.fotosculto_events;
CREATE POLICY fotosculto_events_read ON public.fotosculto_events
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS fotosculto_events_write ON public.fotosculto_events;
CREATE POLICY fotosculto_events_write ON public.fotosculto_events
  FOR ALL TO authenticated
  USING (fotosculto_private.is_staff())
  WITH CHECK (fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_downloads_insert ON public.fotosculto_download_logs;
CREATE POLICY fotosculto_downloads_insert ON public.fotosculto_download_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS fotosculto_downloads_read ON public.fotosculto_download_logs;
CREATE POLICY fotosculto_downloads_read ON public.fotosculto_download_logs
  FOR SELECT TO authenticated
  USING (fotosculto_private.is_staff());

REVOKE ALL ON public.fotosculto_staff FROM anon, authenticated;
REVOKE ALL ON public.fotosculto_settings FROM anon, authenticated;
REVOKE ALL ON public.fotosculto_categories FROM anon, authenticated;
REVOKE ALL ON public.fotosculto_ministries FROM anon, authenticated;
REVOKE ALL ON public.fotosculto_galleries FROM anon, authenticated;
REVOKE ALL ON public.fotosculto_photos FROM anon, authenticated;
REVOKE ALL ON public.fotosculto_videos FROM anon, authenticated;
REVOKE ALL ON public.fotosculto_events FROM anon, authenticated;
REVOKE ALL ON public.fotosculto_download_logs FROM anon, authenticated;

GRANT SELECT ON public.fotosculto_settings TO anon, authenticated;
GRANT SELECT ON public.fotosculto_categories TO anon, authenticated;
GRANT SELECT ON public.fotosculto_ministries TO anon, authenticated;
GRANT SELECT ON public.fotosculto_galleries TO anon, authenticated;
GRANT SELECT ON public.fotosculto_photos TO anon, authenticated;
GRANT SELECT ON public.fotosculto_videos TO anon, authenticated;
GRANT SELECT ON public.fotosculto_events TO anon, authenticated;
GRANT INSERT ON public.fotosculto_download_logs TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_staff TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_ministries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_galleries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_photos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_videos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotosculto_download_logs TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fotosculto',
  'fotosculto',
  true,
  20971520,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS fotosculto_media_public_read ON storage.objects;
CREATE POLICY fotosculto_media_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'fotosculto');

DROP POLICY IF EXISTS fotosculto_media_staff_insert ON storage.objects;
CREATE POLICY fotosculto_media_staff_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'fotosculto' AND fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_media_staff_update ON storage.objects;
CREATE POLICY fotosculto_media_staff_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'fotosculto' AND fotosculto_private.is_staff())
  WITH CHECK (bucket_id = 'fotosculto' AND fotosculto_private.is_staff());

DROP POLICY IF EXISTS fotosculto_media_staff_delete ON storage.objects;
CREATE POLICY fotosculto_media_staff_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'fotosculto' AND fotosculto_private.is_staff());
