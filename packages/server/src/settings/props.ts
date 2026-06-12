import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { SettingsType } from '@reports/shared';

const __dirname = dirname(fileURLToPath(import.meta.url));
const settingsPath = join(__dirname, 'settings.json');

export const getSettings = (): SettingsType => {
  return JSON.parse(readFileSync(settingsPath, 'utf-8'));
};

export const setSettings = (settings: SettingsType): SettingsType => {
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');

  return settings;
};
