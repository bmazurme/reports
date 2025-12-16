import { Text, Select, Button, Icon } from '@gravity-ui/uikit';
import { Moon, Sun } from '@gravity-ui/icons';
import type { MonthKeyType } from '@reports/shared';

import { years } from './constants';
import Report from './report';
import MyCalendar from './calendar';
import Details from './details';
import { AppState } from './App';

import './App.css';
import style from './app.module.css';

type AppLayoutProps = {
  state: AppState;
  theme: 'light' | 'dark';
  setState: (value: AppState | ((prevState: AppState) => AppState)) => void;
  toggleTheme: () => void;
}

function AppLayout({ state, setState, theme, toggleTheme }: AppLayoutProps) {
  return (
    <>
      <Button
        view="outlined"
        className={style.toggle}
        size="l"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Тёмная' : 'Светлая'}
      >
        <Icon
          data={theme === 'light' ? Moon : Sun}
          size={18}
        />
      </Button>
      <Text variant="display-3">{`Note ${state.year}`}</Text>
      <div className={style.total}>
        <Select
          label="Year"
          value={[state.year]}
          className={style.select}
          onUpdate={([t]) => setState((prev) => ({ ...prev, year: t as MonthKeyType }))}
          options={years}
        />
      </div>
        <MyCalendar
          data={state.data!}
          year={state.year}
        />
        <Details
          month={state.month}
          total={state.total}
          data={state.data!}
          setState={setState}
          issues={state.issues}
          closed={state.closed}
        />
      <Report report={state.report} />
    </>
  )
}

export default AppLayout;
