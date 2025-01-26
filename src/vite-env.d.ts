/// <reference types="vite/client" />
declare const VITE_TMDB_API_ACCESS_TOKEN: string;
declare const VITE_TMDB_API_KEY: string;
declare const VITE_SAMPLE_KEY: string;
interface ImportMetaEnv {
  readonly VITE_TMDB_API_ACCESS_TOKEN: string;
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_SAMPLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
