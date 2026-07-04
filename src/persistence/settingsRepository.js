import { tableWidth } from "../data/constants";
import { queryConfig } from "../utils/queryConfig";

const SETTINGS_STORAGE_KEY = "settings";
export const SETTINGS_SCHEMA_VERSION = 1;

export const defaultSettings = {
  strictMode: false,
  showFieldSummary: true,
  showGrid: true,
  snapToGrid: false,
  showDataTypes: true,
  mode: "light",
  autosave: true,
  showCardinality: true,
  showRelationshipLabels: true,
  tableWidth: tableWidth,
  showDebugCoordinates: false,
  showComments: false,
};

const booleanSettingKeys = [
  "strictMode",
  "showFieldSummary",
  "showGrid",
  "snapToGrid",
  "showDataTypes",
  "autosave",
  "showCardinality",
  "showRelationshipLabels",
  "showDebugCoordinates",
  "showComments",
];

function sanitizeSettings(savedSettings) {
  if (!savedSettings || typeof savedSettings !== "object" || Array.isArray(savedSettings)) {
    return defaultSettings;
  }

  const sanitized = { ...defaultSettings };

  for (const key of booleanSettingKeys) {
    if (typeof savedSettings[key] === "boolean") {
      sanitized[key] = savedSettings[key];
    }
  }

  if (queryConfig.theme.isValid(savedSettings.mode)) {
    sanitized.mode = savedSettings.mode;
  }

  if (Number.isFinite(savedSettings.tableWidth) && savedSettings.tableWidth > 0) {
    sanitized.tableWidth = savedSettings.tableWidth;
  }

  return sanitized;
}

function parseStoredSettings(savedSettings) {
  if (
    savedSettings?.schemaVersion === SETTINGS_SCHEMA_VERSION &&
    savedSettings?.settings &&
    typeof savedSettings.settings === "object" &&
    !Array.isArray(savedSettings.settings)
  ) {
    return savedSettings.settings;
  }

  return savedSettings;
}

function applySearchParams(settings, searchParams) {
  const theme = searchParams?.get(queryConfig.theme.key);
  if (queryConfig.theme.isValid(theme)) {
    return { ...settings, mode: theme };
  }

  return settings;
}

export function readSettings(searchParams) {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  let settings = defaultSettings;
  let recovered = false;

  if (savedSettings) {
    try {
      settings = sanitizeSettings(parseStoredSettings(JSON.parse(savedSettings)));
    } catch (error) {
      recovered = true;
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      console.warn("Recovered corrupt settings from localStorage", error);
    }
  }

  return {
    settings: applySearchParams(settings, searchParams),
    recovered,
  };
}

export function writeSettings(settings) {
  try {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: SETTINGS_SCHEMA_VERSION,
        settings: sanitizeSettings(settings),
      }),
    );
  } catch (error) {
    console.warn("Failed to persist settings", error);
  }
}
