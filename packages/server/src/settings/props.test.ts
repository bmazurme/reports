import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { SettingsType } from '@reports/shared';

import { getSettings, setSettings } from './props';

const __dirname = dirname(fileURLToPath(import.meta.url));
const settingsPath = join(__dirname, 'settings.json');

let originalContent: string;

beforeEach(() => {
  originalContent = readFileSync(settingsPath, 'utf-8');
});

afterEach(() => {
  writeFileSync(settingsPath, originalContent);
});

describe('getSettings', () => {
  it('returns the persisted settings', () => {
    const settings = getSettings();

    expect(settings).toHaveProperty('gitlabUrl');
    expect(settings).toHaveProperty('privateToken');
    expect(settings).toHaveProperty('userId');
    expect(settings).toHaveProperty('employee');
    expect(settings).toHaveProperty('company');
  });
});

describe('setSettings', () => {
  it('persists new settings and returns them', () => {
    const newSettings: SettingsType = {
      gitlabUrl: 'https://gitlab.example.com/api/v4',
      privateToken: 'token-123',
      userId: '42',
      employee: 'Test Employee',
      company: 'Test Company',
    };

    const result = setSettings(newSettings);

    expect(result).toEqual(newSettings);
    expect(getSettings()).toEqual(newSettings);
  });
});
