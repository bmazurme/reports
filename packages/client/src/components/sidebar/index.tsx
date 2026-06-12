import { Select, Text, Button, Icon } from '@gravity-ui/uikit';
import {
  House, Calendar as CalendarIcon, Gear, Moon, Sun,
} from '@gravity-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import type { MonthKeyType } from '@reports/shared';

import { years, options } from '../../constants';
import { reportSelector, setReportState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useTheme } from '../../hooks/use-theme';

import style from './sidebar.module.css';

const links = [
  { to: '/', label: 'Report', icon: House },
  { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { to: '/settings', label: 'Settings', icon: Gear },
];

function Sidebar() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(reportSelector);
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  return (
    <div className={style.sidebar}>
      <div className={style.workspace}>
        <div className={style.mark}>R</div>
        <div className={style.meta}>
          <Text variant="subheader-2">Reports</Text>
          <Text variant="caption-2" color="secondary">Time tracking</Text>
        </div>
      </div>
      <div className={style.pad}>
        <nav className={style.nav}>
          {links.map(({ to, label, icon }) => (
            <Button
              key={to}
              view={pathname === to ? 'normal' : 'flat'}
              size="l"
              width="max"
              component={Link}
              to={to}
              className={style.navButton}
            >
              <Icon data={icon} size={16} />
              {label}
            </Button>
          ))}
        </nav>
        <Select
          label="Year"
          value={[state.year]}
          className={style.select}
          onUpdate={([t]) => dispatch(setReportState({ ...state, year: t as MonthKeyType }))}
          options={years}
        />
        <Select
          label="Month"
          value={[state.month]}
          className={style.select}
          onUpdate={([t]) => dispatch(setReportState({ ...state, month: t as MonthKeyType }))}
          options={options}
        />
      </div>
      <div className={style.footer}>
        <Button
          view="flat"
          size="l"
          width="max"
          onClick={toggleTheme}
          className={style.navButton}
          title={theme === 'light' ? 'Тёмная' : 'Светлая'}
        >
          <Icon data={theme === 'light' ? Moon : Sun} size={16} />
          {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar;
