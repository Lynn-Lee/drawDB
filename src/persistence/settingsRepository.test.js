import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  defaultSettings,
  readSettings,
  SETTINGS_SCHEMA_VERSION,
  writeSettings,
} from './settingsRepository';

describe('settingsRepository', () => {
  let storage;

  beforeEach(() => {
    vi.restoreAllMocks();

    storage = new Map();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => storage.get(key) ?? null),
      setItem: vi.fn((key, value) => {
        storage.set(key, String(value));
      }),
      removeItem: vi.fn((key) => {
        storage.delete(key);
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('recovers default settings and clears corrupt localStorage JSON', () => {
    localStorage.setItem('settings', '{broken-json');

    const result = readSettings(new URLSearchParams());

    expect(result).toEqual({
      settings: defaultSettings,
      recovered: true,
    });
    expect(localStorage.getItem('settings')).toBeNull();
  });

  it('keeps saved settings and lets a valid URL theme override the saved mode', () => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        mode: 'light',
        strictMode: true,
        tableWidth: 320,
      }),
    );

    const result = readSettings(new URLSearchParams('theme=dark'));

    expect(result).toEqual({
      settings: {
        ...defaultSettings,
        mode: 'dark',
        strictMode: true,
        tableWidth: 320,
      },
      recovered: false,
    });
  });

  it('sanitizes saved settings by known field and type', () => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        schemaVersion: SETTINGS_SCHEMA_VERSION,
        mode: 'solarized',
        strictMode: 'yes',
        showGrid: false,
        tableWidth: 'wide',
        showComments: true,
        unknownSetting: true,
      }),
    );

    const result = readSettings(new URLSearchParams());

    expect(result).toEqual({
      settings: {
        ...defaultSettings,
        showGrid: false,
        showComments: true,
      },
      recovered: false,
    });
    expect(result.settings).not.toHaveProperty('schemaVersion');
    expect(result.settings).not.toHaveProperty('unknownSetting');
  });

  it('persists current schema version and sanitized settings only', () => {
    writeSettings({
      ...defaultSettings,
      mode: 'dark',
      tableWidth: 420,
      strictMode: 'yes',
      unknownSetting: true,
    });

    expect(JSON.parse(localStorage.getItem('settings'))).toEqual({
      schemaVersion: SETTINGS_SCHEMA_VERSION,
      settings: {
        ...defaultSettings,
        mode: 'dark',
        tableWidth: 420,
      },
    });
  });

  it('ignores invalid URL theme values', () => {
    localStorage.setItem('settings', JSON.stringify({ mode: 'dark' }));

    const result = readSettings(new URLSearchParams('theme=system'));

    expect(result.settings.mode).toBe('dark');
    expect(result.recovered).toBe(false);
  });

  it('does not throw when localStorage write fails', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem.mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => writeSettings(defaultSettings)).not.toThrow();
    expect(consoleWarn).toHaveBeenCalledWith(
      'Failed to persist settings',
      expect.any(Error),
    );
  });
});
