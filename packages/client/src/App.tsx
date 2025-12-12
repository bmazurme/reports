import { useEffect, useState } from 'react';
import { Text, Select, Loader, ThemeProvider, Button, Icon } from '@gravity-ui/uikit';
import { Moon, Sun } from '@gravity-ui/icons';

import type { DateType, MonthKeyType } from '@reports/shared';
import { years } from './constants';
import { RowData } from './hocs/with-table-sorting';
import { getInitialTheme } from './utils/get-initial-theme';
import Report from './report';
import MyCalendar from './calendar';
import Details from './details';

import fetchDataFromApi from './api';

import './App.css';
import style from './app.module.css';

export type AppState = {
  data: DateType | null;
  report: RowData[];
  total: number;
  month: MonthKeyType;
  year: string;
};

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [state, setState] = useState<AppState>({
    data: null,
    report: [],
    total: 0,
    month: '12',
    year: '2025',
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Не удалось сохранить тему в localStorage', error);
    }
  }, [theme]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const { countsData, reportData } = await fetchDataFromApi(state.year);

        if (!ignore) {
          setState((prev) => ({
            ...prev,
            data: countsData,
            report: reportData.map((x, i) => ({
              ...x,
              id: i.toString(),
              meta: { sort: true },
            })),
            total: reportData.reduce((a, x) => a + x.time, 0),
          }));
        }
        } catch (error) {
          console.error('There was a problem with the fetch operations:', error);
        }
      };

    fetchData();

    return () => {
      ignore = true; // Отменяем старый запрос при новом эффекте
    };
  }, [state.year]);

  return (
    <ThemeProvider theme={theme}>
    {!state.data
      ? <Loader size="s" />
      :
        <>
          <Button
            view="outlined"
            className={style.toggle}
            size="l"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Тёмная' : 'Светлая'}
          >
            <Icon data={theme === 'light' ? Moon : Sun} size={18} />
          </Button>
          <Text variant="display-3">{`Note ${state.year}`}</Text><div className={style.total}>
          <Select
            label="Year"
            value={[state.year]}
            className={style.select}
            onUpdate={([t]) => setState((prev) => ({ ...prev, year: t as MonthKeyType }))}
            options={years}
          />
          </div>
            <MyCalendar
              data={state.data}
              year={state.year}
            />
            <Details
              month={state.month}
              total={state.total}
              data={state.data}
              setState={setState}
            />
          <Report report={state.report} />
        </>
      }
    </ThemeProvider>
  )
}

export default App;
