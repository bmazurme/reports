import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@gravity-ui/uikit';
import type { SettingsType } from '@reports/shared';

import { store } from '../../store';
import Settings from './index';

const unwrap = vi.fn().mockResolvedValue({
  gitlabUrl: 'https://gitlab.example.com/api/v4',
  privateToken: 'secret',
  userId: '1',
  employee: 'Иван Иванов',
  company: 'ACME',
});
const setSettingsRequest = vi.fn((settings: SettingsType) => {
  void settings;
  return { unwrap };
});

vi.mock('../../store/api', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useSetSettingsMutation: () => [setSettingsRequest],
}));

const renderSettings = () =>
  render(
    <Provider store={store}>
      <ThemeProvider theme="light">
        <Settings />
      </ThemeProvider>
    </Provider>,
  );

describe('Settings page', () => {
  beforeEach(() => {
    setSettingsRequest.mockClear();
    unwrap.mockClear();
    localStorage.clear();
  });

  it('groups GitLab URL/Private token separately from the other fields', () => {
    renderSettings();

    const gitlabUrlGroup = screen.getByLabelText('GitLab URL').closest('div');
    const privateTokenGroup = screen.getByLabelText('Private token').closest('div');
    const userIdGroup = screen.getByLabelText('User ID').closest('div');

    expect(gitlabUrlGroup).toBe(privateTokenGroup);
    expect(gitlabUrlGroup).not.toBe(userIdGroup);
  });

  it('submits the form to the backend on save', async () => {
    renderSettings();

    await userEvent.type(screen.getByLabelText('GitLab URL'), 'https://gitlab.example.com/api/v4');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(setSettingsRequest).toHaveBeenCalledTimes(1);
    expect(setSettingsRequest.mock.calls[0][0]).toMatchObject({
      gitlabUrl: 'https://gitlab.example.com/api/v4',
    });
  });
});
