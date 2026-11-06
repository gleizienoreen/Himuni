/**
 * Centralized Audius API configuration for HIMUNI.
 * Uses read-only public access identified by app_name='himuni'.
 * Never include private secrets or Bearer tokens in frontend configuration.
 */
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const AUDIUS_CONFIG = {
  appName: (env.VITE_AUDIUS_APP_NAME || 'himuni').trim() || 'himuni',
  apiBaseUrl: (env.VITE_AUDIUS_API_BASE || 'https://api.audius.co/v1').replace(/\/+$/, ''),
  discoveryHostListUrl: 'https://api.audius.co',
  webOrigin: 'https://audius.co',
  apiKey: (env.VITE_AUDIUS_API_KEY || '').trim(),
  requestTimeoutMs: 12000,
  cacheTtlMs: 90 * 1000, // Short-lived 90s in-memory reuse to prevent duplicate calls
  maxCacheEntries: 40,
  maxConcurrentRequests: 3,
  defaultLimit: 10,
};
