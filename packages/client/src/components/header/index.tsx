import { Text, Button, Icon } from '@gravity-ui/uikit';
import { Moon, Sun } from '@gravity-ui/icons';

import { useTheme } from '../../hooks/use-theme';
import { reportSelector } from '../../store';
import { useAppSelector } from '../../hooks';

import style from './header.module.css';

function Header() {
  const state = useAppSelector(reportSelector);
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  return (
    <div className={style.headerRow}>
      <div className={style.headerLeft}>
        <div className={style.mark}>R</div>
        <div className={style.titleBlock}>
          <Text variant="header-1">Report</Text>
          <Text variant="subheader-1">{state.year}</Text>
        </div>
      </div>
      <Button
        view="flat"
        size="l"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Тёмная' : 'Светлая'}
      >
        <Icon
          data={theme === 'light' ? Moon : Sun}
          size={18}
        />
      </Button>
    </div>
  )
}

export default Header;
