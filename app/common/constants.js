export const VERSION = '2.0.0';
export const RAVEN_DSN = 'https://0e8d8bd5cc8142dda1cedeaabc91b1d2@sentry.io/286123';
export const IS_DEV_ENV = process.env.NODE_ENV === 'development';
export const IS_PROD_ENV = process.env.NODE_ENV === 'production';
const DEV_DOMAIN = 'https://staging.kaniwani.com';
const PROD_DOMAIN = 'https://www.kaniwani.com';
const BASE_URL = IS_DEV_ENV ? DEV_DOMAIN : PROD_DOMAIN;

export const API_BASE = `${BASE_URL}/api/v1/`;

export const SESSION_EXPIRY_MINUTES = 30;

export const DATE_FORMAT = 'MMM Do YYYY';
export const TIME_FORMAT = 'hh:mma';
export const DATE_TIME_FORMAT = `${DATE_FORMAT}[,] ${TIME_FORMAT}`;

export const MAX_NOTES_LENGTH = 500;
export const MAX_CONTACT_LENGTH = 1000;

export const WK_SRS_RANKS = {
  ONE: 'APPRENTICE',
  TWO: 'GURU',
  THREE: 'MASTER',
  FOUR: 'ENLIGHTENED',
  FIVE: 'BURNED',
};

export const SRS_RANKS = {
  ZERO: 'UNTRAINED',
  ...WK_SRS_RANKS,
};

export const SRS_RANGES = {
  ZERO: [0],
  ONE: [1, 2, 3, 4],
  TWO: [5, 6],
  THREE: [7],
  FOUR: [8],
  FIVE: [9],
};

export const KEYCODES = {
  SPACE: 32,
  ENTER: 13,
};

export const TAGS = {
  common: 'common',
  MA: 'Martial Arts',
  X: 'Rude/X-Rated',
  abbr: 'Abbreviation',
  adj: 'Adjective',
  'adj-i': 'I Adjective',
  'adj-ix': 'I Adjective',
  'adj-na': 'Na Adjective',
  'adj-no': 'No Adjective',
  'adj-pn': 'Pre-Noun Adjectival',
  'adj-t': 'Taru Adjective',
  'adj-f': 'Prenominal Noun/Verb',
  adv: 'Adverb',
  'adv-to': 'To Adverb',
  arch: 'Archaism',
  ateji: 'Ateji',
  aux: 'Auxiliary',
  'aux-v': 'Auxiliary Verb',
  'aux-adj': 'Auxiliary Adjective',
  Buddh: 'Buddhist',
  chem: 'Chemistry',
  chn: 'Childish',
  col: 'Colloquial',
  comp: 'Computer',
  conj: 'Conjunction',
  'cop-da': 'Copula',
  ctr: 'Counter',
  derog: 'Derogatory',
  eK: 'Kanji Only',
  ek: 'Kana Only',
  exp: 'Expression',
  fam: 'Familiar',
  fem: 'Feminine',
  food: 'Food',
  geom: 'Geometry',
  gikun: 'Gikun/Jukujikun',
  hon: 'Honorific (sonkeigo)',
  hum: 'Humble (kenjougo)',
  iK: 'Irregular Kanji',
  id: 'Idiom',
  ik: 'Irregular Kana',
  int: 'Interjection',
  io: 'Irregular Okurigana',
  iv: 'Irregular Verb',
  ling: 'Linguistics',
  'm-sl': 'Manga Slang',
  male: 'Masculine',
  'male-sl': 'Male Slang',
  math: 'Mathematics',
  mil: 'Military',
  n: 'Noun',
  'n-adv': 'Adverbial Noun',
  'n-suf': 'Noun Suffix',
  'n-pref': 'Noun Prefix',
  'n-t': 'Temporal Noun',
  num: 'Numeric',
  oK: 'Out-dated Kanji',
  obs: 'Obsolete',
  obsc: 'Obscure',
  ok: 'Out-Dated Kana',
  oik: 'Old/Irregular Kana',
  'on-mim': 'Onomatopoeic/Mimetic',
  pn: 'Pronoun',
  poet: 'Poetry',
  pol: 'Polite (teineigo)',
  pref: 'Prefix',
  proverb: 'Proverb',
  prt: 'Particle',
  physics: 'Physics',
  rare: 'Rare',
  sens: 'Sensitive',
  sl: 'Slang',
  suf: 'Suffix',
  uK: 'Usually Kanji',
  uk: 'Usually Kana',
  unc: 'Unclassified',
  yoji: 'Yojijukugo',
  v1: 'Ichidan Verb',
  'v1-s': 'Ichidan Verb',
  'v2a-s': 'Nidan Verb',
  v4h: 'Yodan Verb',
  v4r: 'Yodan Verb',
  v5: 'Godan Verb',
  v5aru: 'Godan Verb',
  v5b: 'Godan Verb',
  v5g: 'Godan Verb',
  v5k: 'Godan Verb',
  'v5k-s': 'Godan Verb',
  v5m: 'Godan Verb',
  v5n: 'Godan Verb',
  v5r: 'Godan Verb',
  'v5r-i': 'Godan Verb',
  v5s: 'Godan Verb',
  v5t: 'Godan Verb',
  v5u: 'Godan Verb',
  'v5u-s': 'Godan Verb',
  v5uru: 'Godan Verb',
  vz: 'Ichidan Verb',
  vi: 'Intransitive Verb',
  vk: 'Kuru Verb',
  vn: 'Irregular Verb',
  vr: 'Irregular Verb',
  vs: 'Suru Verb',
  'vs-c': 'Su Verb',
  'vs-s': 'Suru Verb',
  'vs-i': 'Irregular Suru Verb',
  kyb: 'Kyoto-ben',
  osb: 'Osaka-ben',
  ksb: 'Kansai-ben',
  ktb: 'Kantou-ben',
  tsb: 'Tosa-ben',
  thb: 'Touhoku-ben',
  tsug: 'Tsugaru-ben',
  kyu: 'Kyuushuu-ben',
  rkb: 'Ryuukyuu-ben',
  nab: 'Nagano-ben',
  hob: 'Hokkaido-ben',
  vt: 'Transitive verb',
  vulg: 'Vulgar',
  'adj-kari': 'Adjective',
  'adj-ku': 'Adjective',
  'adj-shiku': 'Adjective',
  'adj-nari': 'Adjective',
  'n-pr': 'Proper Noun',
  'v-unspec': 'Verb',
  v4k: 'Yodan Verb',
  v4g: 'Yodan Verb',
  v4s: 'Yodan Verb',
  v4t: 'Yodan Verb',
  v4n: 'Yodan Verb',
  v4b: 'Yodan Verb',
  v4m: 'Yodan Verb',
  'v2k-k': 'Nidan Verb',
  'v2g-k': 'Nidan Verb',
  'v2t-k': 'Nidan Verb',
  'v2d-k': 'Nidan Verb',
  'v2h-k': 'Nidan Verb',
  'v2b-k': 'Nidan Verb',
  'v2m-k': 'Nidan Verb',
  'v2y-k': 'Nidan Verb',
  'v2r-k': 'Nidan Verb',
  'v2k-s': 'Nidan Verb',
  'v2g-s': 'Nidan Verb',
  'v2s-s': 'Nidan Verb',
  'v2z-s': 'Nidan Verb',
  'v2t-s': 'Nidan Verb',
  'v2d-s': 'Nidan Verb',
  'v2n-s': 'Nidan Verb',
  'v2h-s': 'Nidan Verb',
  'v2b-s': 'Nidan Verb',
  'v2m-s': 'Nidan Verb',
  'v2y-s': 'Nidan Verb',
  'v2r-s': 'Nidan Verb',
  'v2w-s': 'Nidan Verb',
  archit: 'Architecture',
  astron: 'Astronomy',
  baseb: 'Baseball',
  biol: 'Biology',
  bot: 'Botany',
  bus: 'Business',
  econ: 'Economics',
  engr: 'Engineering',
  finc: 'Finance',
  geol: 'Geology',
  law: 'Law',
  mahj: 'Mahjong',
  med: 'Medicine',
  music: 'Music',
  Shinto: 'Shinto',
  shogi: 'Shogi',
  sports: 'Sports',
  sumo: 'Sumo',
  zool: 'Zoology',
  joc: 'Joking',
  anat: 'Anatomical',
};
