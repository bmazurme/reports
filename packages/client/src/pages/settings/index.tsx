import { useState, type FormEvent } from 'react';
import { Button, TextInput, Text, Icon } from '@gravity-ui/uikit';
import { Eye, EyeSlash } from '@gravity-ui/icons';

import { settingsSelector, setSettings, type SettingsState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';

import style from './settings.module.css';

function Settings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(settingsSelector);
  const [form, setForm] = useState<SettingsState>(settings);
  const [showToken, setShowToken] = useState(false);

  const handleChange = (key: keyof SettingsState) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(setSettings(form));
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <Text variant="header-2">Settings</Text>
      <TextInput
        label="GitLab URL"
        placeholder="https://gitlab.com/api/v4"
        value={form.gitlabUrl}
        onUpdate={handleChange('gitlabUrl')}
      />
      <TextInput
        label="Private token"
        type={showToken ? 'text' : 'password'}
        value={form.privateToken}
        onUpdate={handleChange('privateToken')}
        endContent={(
          <Button
            view="flat"
            size="s"
            onClick={() => setShowToken((prev) => !prev)}
            title={showToken ? 'Hide' : 'Show'}
          >
            <Icon data={showToken ? EyeSlash : Eye} size={16} />
          </Button>
        )}
      />
      <TextInput
        label="User ID"
        value={form.userId}
        onUpdate={handleChange('userId')}
      />
      <Button view="action" size="l" type="submit" width="max">
        Save
      </Button>
    </form>
  )
}

export default Settings;
