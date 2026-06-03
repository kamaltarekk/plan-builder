/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOLD_PRICE_PER_GRAM?: string;
  readonly VITE_SILVER_PRICE_PER_GRAM?: string;
  readonly VITE_SILVER_PRICE_PER_OUNCE?: string;
  readonly VITE_PRICE_UPDATED_AT?: string;
  readonly VITE_SABIKA_INSTALL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: Array<Record<string, unknown>>;
}
