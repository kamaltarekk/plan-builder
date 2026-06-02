// Single source of truth for the Sabika install/app CTA link.
// Override at build time with VITE_SABIKA_INSTALL_URL.
const DEFAULT_INSTALL_URL = 'https://sabika.go.link/eBoSi';

export const SABIKA_INSTALL_URL =
  import.meta.env.VITE_SABIKA_INSTALL_URL?.trim() || DEFAULT_INSTALL_URL;
