import { Gallery, Photo, VideoItem, Ministry, Category, ChurchEvent, SiteSettings } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  churchName: 'AD BARRAVENTO',
  subtitle: 'Vivendo, registrando e compartilhando momentos de fé.',
  alternativeSubtitles: [
    'Momentos que ficam na memória.',
    'Vivendo, registrando e compartilhando momentos de fé.',
    'Nossa fé. Nossa comunhão. Nossos momentos.'
  ],
  phone: '(62) 3298-1020',
  whatsapp: '5562984501234',
  instagram: '@adbarravento',
  youtube: 'https://youtube.com/@adbarravento',
  email: 'contato@adbarravento.com.br',
  address: 'Av. Marechal Rondon, Qd. 14, Lt. 08',
  neighborhood: 'Setor Barravento',
  city: 'Goiânia - GO',
  cultSchedule: [
    { day: 'Domingo', time: '09:00', title: 'Escola Bíblica Dominical (EBD)', description: 'Estudo aprofundado das escrituras para todas as idades.' },
    { day: 'Domingo', time: '19:00', title: 'Culto de Celebração & Família', description: 'Celebração com louvor congregacional e ministração da Palavra.' },
    { day: 'Terça-feira', time: '19:30', title: 'Tarde da Bênção & Oração', description: 'Momento de intercessão e clamor pelas famílias.' },
    { day: 'Quarta-feira', time: '19:30', title: 'Culto de Doutrina e Ensino Bíblico', description: 'Edificação bíblica sólida com nossos pastores.' },
    { day: 'Sábado', time: '19:00', title: 'Culto dos Jovens / Conexão', description: 'Adoração jovem, comunhão e mensagens práticas.' }
  ],
  defaultWatermarkText: 'AD BARRAVENTO',
  enableWatermarkDefault: true,
  heroImageUrl: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1920&q=85',
  historyText: 'A Igreja Assembleia de Deus no Setor Barravento nasceu do sonho de proclamar as boas novas do Evangelho de Cristo, acolhendo famílias e transformando vidas através do amor de Deus. Ao longo dos anos, temos sido um farol de esperança na comunidade, crescendo em comunhão, oração e serviço voluntário.',
  missionText: 'Glorificar a Deus, proclamar as verdades do Evangelho a todas as pessoas, promover a comunhão fraterna e discipular novas gerações nos caminhos do Senhor.',
  visionText: 'Ser uma igreja acolhedora, vibrante e relevante para a nossa cidade, gerando discípulos apaixonados por Jesus e comprometidos com a Palavra de Deus.',
  valuesText: 'Fidelidade às Escrituras • Amor e Acolhimento • Integridade • Oração e Louvor • Serviço ao Próximo • Excelência para o Reino.'
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-todos', name: 'Todos', slug: 'todos', color: 'slate' },
  { id: 'cat-cultos', name: 'Cultos', slug: 'cultos', color: 'blue' },
  { id: 'cat-santaceia', name: 'Santa Ceia', slug: 'santa-ceia', color: 'purple' },
  { id: 'cat-jovens', name: 'Jovens', slug: 'jovens', color: 'indigo' },
  { id: 'cat-mulheres', name: 'Mulheres', slug: 'mulheres', color: 'pink' },
  { id: 'cat-criancas', name: 'Crianças', slug: 'criancas', color: 'amber' },
  { id: 'cat-homens', name: 'Homens', slug: 'homens', color: 'cyan' },
  { id: 'cat-eventos', name: 'Eventos', slug: 'eventos', color: 'emerald' },
  { id: 'cat-congressos', name: 'Congressos', slug: 'congressos', color: 'violet' },
  { id: 'cat-ebd', name: 'Escola Bíblica', slug: 'escola-biblica', color: 'teal' },
  { id: 'cat-outros', name: 'Outros', slug: 'outros', color: 'stone' }
];

export const INITIAL_MINISTRIES: Ministry[] = [
  {
    id: 'min-jovens',
    name: 'Jovens (Conexão Barravento)',
    slug: 'jovens',
    description: 'Movimento de jovens comprometidos com a Palavra, oração e evangelismo dinâmico na cidade.',
    leader: 'Pr. Lucas e Lívia Andrade',
    leaderRole: 'Líderes de Jovens',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    meetingSchedule: 'Todo sábado às 19h00',
    order: 1
  },
  {
    id: 'min-mulheres',
    name: 'Mulheres de Fé',
    slug: 'mulheres',
    description: 'Comunhão, apoio mútuo, oração fervorosa e ensinamentos para o coração da mulher cristã contemporânea.',
    leader: 'Pra. Débora Silva',
    leaderRole: 'Coordenadora Geral',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    meetingSchedule: '2ª terça-feira do mês e congressos',
    order: 2
  },
  {
    id: 'min-homens',
    name: 'Homens de Propósito',
    slug: 'homens',
    description: 'Capacitando homens para liderarem seus lares com sabedoria bíblica, sacerdócio e honra.',
    leader: 'Pb. Marcelo Ribeiro',
    leaderRole: 'Líder dos Homens',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    meetingSchedule: 'Último sábado do mês às 08h00',
    order: 3
  },
  {
    id: 'min-infantil',
    name: 'Geração Futuro (Infantil)',
    slug: 'infantil',
    description: 'Espaço seguro, didático e alegre para ensinar os princípios de Jesus para as nossas crianças.',
    leader: 'Tia Juliana e Equipe Pedagógica',
    leaderRole: 'Coordenação Infantil',
    image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
    meetingSchedule: 'Em todos os cultos de domingo e quarta',
    order: 4
  },
  {
    id: 'min-louvor',
    name: 'Louvor & Artes',
    slug: 'louvor',
    description: 'Servindo ao Senhor através da música congregacional de adoração com dedicação e excelência espiritual.',
    leader: 'Ministro Samuel Costa',
    leaderRole: 'Diretor Musical',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    meetingSchedule: 'Ensaios às quintas às 19h30',
    order: 5
  },
  {
    id: 'min-intercessao',
    name: 'Sentinelas da Oração',
    slug: 'intercessao',
    description: 'Coluna espiritual de sustento em intercessão contínua pelas famílias, liderança e pedidos da igreja.',
    leader: 'Diaconisa Neide',
    leaderRole: 'Líder de Intercessão',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    meetingSchedule: 'Terças às 15h e antes dos cultos',
    order: 6
  }
];

export const INITIAL_GALLERIES: Gallery[] = [
  {
    id: 'gal-celebracao-18-09-2026',
    title: 'Culto de Celebração & Palavra',
    slug: 'culto-de-celebracao-18-09-2026',
    description: 'Uma noite inesquecível de adoração com toda a igreja reunida em louvor e profunda ministração sobre a Fidelidade de Deus.',
    date: '2026-09-18',
    time: '19:00',
    coverPhoto: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-cultos',
    categoryName: 'Cultos',
    ministryId: 'min-louvor',
    ministryName: 'Louvor & Artes',
    location: 'Templo Principal - AD Barravento',
    watermarkEnabled: true,
    featured: true,
    status: 'publicada',
    photoCount: 24,
    publishedAt: '2026-09-18T22:30:00Z',
    createdAt: '2026-09-18T22:00:00Z',
    updatedAt: '2026-09-18T22:30:00Z'
  },
  {
    id: 'gal-mulheres-12-09-2026',
    title: 'Culto de Mulheres: Florescer na Graça',
    slug: 'culto-de-mulheres-12-09-2026',
    description: 'Encontro abençoado com testemunhos tocantes, louvor ministrado pelas irmãs e mensagem impactante de restauração familiar.',
    date: '2026-09-12',
    time: '19:30',
    coverPhoto: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-mulheres',
    categoryName: 'Mulheres',
    ministryId: 'min-mulheres',
    ministryName: 'Mulheres de Fé',
    location: 'Templo Principal - AD Barravento',
    watermarkEnabled: true,
    featured: true,
    status: 'publicada',
    photoCount: 18,
    publishedAt: '2026-09-13T09:00:00Z',
    createdAt: '2026-09-12T23:00:00Z',
    updatedAt: '2026-09-13T09:00:00Z'
  },
  {
    id: 'gal-santaceia-06-09-2026',
    title: 'Santa Ceia do Senhor & Comunhão',
    slug: 'santa-ceia-do-senhor-06-09-2026',
    description: 'Momento solene e comovente de celebração do sacrifício na cruz, perdão, renovo espiritual e mesa compartilhada entre irmãos.',
    date: '2026-09-06',
    time: '18:30',
    coverPhoto: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-santaceia',
    categoryName: 'Santa Ceia',
    ministryId: 'min-intercessao',
    ministryName: 'Sentinelas da Oração',
    location: 'Templo Sede',
    watermarkEnabled: true,
    featured: true,
    status: 'publicada',
    photoCount: 16,
    publishedAt: '2026-09-06T21:40:00Z',
    createdAt: '2026-09-06T21:00:00Z',
    updatedAt: '2026-09-06T21:40:00Z'
  },
  {
    id: 'gal-jovens-aviva-28-08-2026',
    title: 'Congresso de Jovens: Aviva Barravento',
    slug: 'congresso-de-jovens-aviva-28-08-2026',
    description: 'Três dias de avivamento intenso, bandas convidadas, comunhão vibrante, vidas entregues a Cristo e batismo no Espírito Santo.',
    date: '2026-08-28',
    time: '19:00',
    coverPhoto: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-congressos',
    categoryName: 'Congressos',
    ministryId: 'min-jovens',
    ministryName: 'Jovens (Conexão Barravento)',
    location: 'Auditório Central AD Barravento',
    watermarkEnabled: true,
    featured: true,
    status: 'publicada',
    photoCount: 22,
    publishedAt: '2026-08-29T10:00:00Z',
    createdAt: '2026-08-28T23:30:00Z',
    updatedAt: '2026-08-29T10:00:00Z'
  },
  {
    id: 'gal-infantil-24-08-2026',
    title: 'Ministério Infantil: Geração do Amanhã',
    slug: 'ministerio-infantil-geracao-do-amanha-24-08-2026',
    description: 'Tarde especial com teatro bíblico das crianças, apresentação de fantoches, gincanas educativas e louvores contagiantes.',
    date: '2026-08-24',
    time: '16:00',
    coverPhoto: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-criancas',
    categoryName: 'Crianças',
    ministryId: 'min-infantil',
    ministryName: 'Geração Futuro (Infantil)',
    location: 'Espaço Kids Barravento',
    watermarkEnabled: true,
    featured: false,
    status: 'publicada',
    photoCount: 14,
    publishedAt: '2026-08-24T19:00:00Z',
    createdAt: '2026-08-24T18:00:00Z',
    updatedAt: '2026-08-24T19:00:00Z'
  },
  {
    id: 'gal-homens-15-08-2026',
    title: 'Encontro de Homens: Líderes do Lar',
    slug: 'encontro-de-homens-lideres-do-lar-15-08-2026',
    description: 'Café da manhã fraterno com palavra poderosa para os pais, jovens rapazes e líderes da igreja sobre sacerdócio na família.',
    date: '2026-08-15',
    time: '08:30',
    coverPhoto: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-homens',
    categoryName: 'Homens',
    ministryId: 'min-homens',
    ministryName: 'Homens de Propósito',
    location: 'Salão Social AD Barravento',
    watermarkEnabled: true,
    featured: false,
    status: 'publicada',
    photoCount: 12,
    publishedAt: '2026-08-15T12:00:00Z',
    createdAt: '2026-08-15T11:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z'
  }
];

// Rich set of realistic curated worship photos
const SAMPLE_PHOTO_SEEDS = [
  { url: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4', caption: 'Momento de adoração congregacional' },
  { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', caption: 'Luzes e louvor no altar' },
  { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', caption: 'Banda congregacional ao vivo' },
  { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18', caption: 'Irmãs louvando com alegria' },
  { url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf', caption: 'Mãos erguidas em gratidão' },
  { url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3', caption: 'Comunhão e palavra no altar' },
  { url: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579', caption: 'Ceia sagrada e comunhão fraterna' },
  { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2', caption: 'Ministração pastoral' },
  { url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94', caption: 'Jovens unidos em oração' },
  { url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9', caption: 'Apresentação das crianças' },
  { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7', caption: 'Celebração e gratidão' },
  { url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1', caption: 'Abraço fraterno entre irmãos' },
  { url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96', caption: 'Reflexão na presença do Pai' },
  { url: 'https://images.unsplash.com/photo-1508997449629-303059a039c0', caption: 'Bíblia aberta e estudo' },
  { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205', caption: 'Encontro caloroso da família de Deus' },
  { url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6', caption: 'Momentos de fé que marcam' }
];

export function generateInitialPhotos(): Photo[] {
  const photos: Photo[] = [];
  
  INITIAL_GALLERIES.forEach((gallery) => {
    const count = gallery.photoCount;
    for (let i = 1; i <= count; i++) {
      const seedIndex = (i - 1 + gallery.title.length) % SAMPLE_PHOTO_SEEDS.length;
      const seed = SAMPLE_PHOTO_SEEDS[seedIndex];
      const photoId = `photo-${gallery.id}-${i}`;
      const baseUrl = seed.url;

      photos.push({
        id: photoId,
        galleryId: gallery.id,
        // High-res original for download (clean, no watermark)
        originalUrl: `${baseUrl}?auto=format&fit=crop&w=2400&q=95`,
        // Web optimized version
        webUrl: `${baseUrl}?auto=format&fit=crop&w=1400&q=85`,
        // Mobile & grid thumbnail
        thumbnailUrl: `${baseUrl}?auto=format&fit=crop&w=600&q=75`,
        filename: `AD_BARRAVENTO_${gallery.slug}_foto_${String(i).padStart(3, '0')}.jpg`,
        caption: `${seed.caption} - ${gallery.title} (${i}/${count})`,
        width: 2400,
        height: 1600,
        fileSize: 3450000 + (i * 123456) % 1500000,
        fileSizeFormatted: `${(3.2 + (i % 5) * 0.4).toFixed(1)} MB`,
        sortOrder: i,
        downloads: 14 + (i * 7) % 89,
        createdAt: gallery.createdAt
      });
    }
  });

  return photos;
}

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-01',
    title: 'Culto de Celebração: O Deus Que Sustenta a Tua Casa',
    description: 'Mensagem ministrada pelo Pr. Presidente no culto de domingo, trazendo esperança e restauração para o seu lar.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'pGzL-Xf_8Z8', // Worship placeholder video id
    thumbnailUrl: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-18',
    eventName: 'Culto de Celebração',
    duration: '1h 24m',
    featured: true,
    createdAt: '2026-09-18T23:00:00Z'
  },
  {
    id: 'vid-02',
    title: 'Aftermovie Oficial: Congresso Aviva Barravento 2026',
    description: 'Melhores momentos dos três dias de louvor, salvação de almas e manifestação da glória de Deus com a nossa juventude.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-30',
    eventName: 'Congresso de Jovens',
    duration: '4m 32s',
    featured: true,
    createdAt: '2026-08-30T15:00:00Z'
  },
  {
    id: 'vid-03',
    title: 'Noite de Louvor e Adoração Congregacional',
    description: 'Cânticos que tocam o coração e convidam a igreja a uma experiência profunda na presença do Altíssimo.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'fJ9rUzIMcZQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-06',
    eventName: 'Santa Ceia do Senhor',
    duration: '22m 15s',
    featured: false,
    createdAt: '2026-09-07T10:00:00Z'
  },
  {
    id: 'vid-04',
    title: 'Apresentação Musical Especial das Crianças',
    description: 'Nossos pequeninos louvando a Deus de todo o coração com gestos e alegria pura.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: '3JZ_D3ELwOQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-24',
    eventName: 'Culto Infantil',
    duration: '12m 40s',
    featured: false,
    createdAt: '2026-08-24T20:00:00Z'
  }
];

export const INITIAL_AGENDA_EVENTS: ChurchEvent[] = [
  {
    id: 'ev-01',
    title: 'Culto de Celebração & Família',
    date: '2026-09-20',
    time: '19:00',
    dayOfWeek: 'DOMINGO',
    dayNumber: '20',
    month: 'SET',
    location: 'Templo Sede AD Barravento',
    description: 'Culto congregacional com louvor e palavra de esperança para toda a família.',
    category: 'Cultos',
    featured: true
  },
  {
    id: 'ev-02',
    title: 'Culto de Doutrina & Ensino Bíblico',
    date: '2026-09-23',
    time: '19:30',
    dayOfWeek: 'QUARTA',
    dayNumber: '23',
    month: 'SET',
    location: 'Templo Sede AD Barravento',
    description: 'Estudo sequencial das epístolas bíblicas com o pastor.',
    category: 'Escola Bíblica',
    featured: false
  },
  {
    id: 'ev-03',
    title: 'Encontro Conexão Jovem',
    date: '2026-09-26',
    time: '19:00',
    dayOfWeek: 'SÁBADO',
    dayNumber: '26',
    month: 'SET',
    location: 'Espaço Conexão - AD Barravento',
    description: 'Uma noite de comunhão, adoração vibrante e partilha para jovens e adolescentes.',
    category: 'Jovens',
    ministryId: 'min-jovens',
    featured: true
  },
  {
    id: 'ev-04',
    title: 'Café de Comunhão das Mulheres',
    date: '2026-10-03',
    time: '09:00',
    dayOfWeek: 'SÁBADO',
    dayNumber: '03',
    month: 'OUT',
    location: 'Salão de Eventos da Igreja',
    description: 'Café da manhã com palestra edificante e oração entre irmãs.',
    category: 'Mulheres',
    ministryId: 'min-mulheres',
    featured: false
  },
  {
    id: 'ev-05',
    title: 'Santa Ceia Geral & Culto de Missões',
    date: '2026-10-04',
    time: '18:30',
    dayOfWeek: 'DOMINGO',
    dayNumber: '04',
    month: 'OUT',
    location: 'Templo Sede AD Barravento',
    description: 'Celebração da Ceia do Senhor com testemunho de campos missionários.',
    category: 'Santa Ceia',
    featured: true
  },
  {
    id: 'ev-06',
    title: 'Cruzada Evangelística no Bairro',
    date: '2026-10-10',
    time: '18:00',
    dayOfWeek: 'SÁBADO',
    dayNumber: '10',
    month: 'OUT',
    location: 'Praça Central do Setor Barravento',
    description: 'Ação comunitária, atendimento às famílias e pregação pública ao ar livre.',
    category: 'Eventos',
    featured: true
  }
];

export const INITIAL_DOWNLOAD_LOGS = [
  { id: 'dl-1', galleryId: 'gal-celebracao-18-09-2026', galleryTitle: 'Culto de Celebração & Palavra', type: 'album' as const, count: 24, createdAt: '2026-09-18T23:12:00Z' },
  { id: 'dl-2', galleryId: 'gal-celebracao-18-09-2026', galleryTitle: 'Culto de Celebração & Palavra', type: 'single' as const, count: 1, createdAt: '2026-09-18T23:25:00Z' },
  { id: 'dl-3', galleryId: 'gal-mulheres-12-09-2026', galleryTitle: 'Culto de Mulheres: Florescer na Graça', type: 'multiple' as const, count: 4, createdAt: '2026-09-13T10:15:00Z' },
  { id: 'dl-4', galleryId: 'gal-jovens-aviva-28-08-2026', galleryTitle: 'Congresso de Jovens: Aviva Barravento', type: 'album' as const, count: 22, createdAt: '2026-08-30T14:40:00Z' },
  { id: 'dl-5', galleryId: 'gal-santaceia-06-09-2026', galleryTitle: 'Santa Ceia do Senhor & Comunhão', type: 'single' as const, count: 1, createdAt: '2026-09-07T08:00:00Z' }
];
