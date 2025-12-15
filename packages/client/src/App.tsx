import { useEffect, useState } from 'react';
import { Loader, ThemeProvider } from '@gravity-ui/uikit';
import type { DateType, MonthKeyType } from '@reports/shared';

import { RowData } from './hocs/with-table-sorting';
import { getInitialTheme } from './utils/get-initial-theme';
import AppLayout from './app-layout';

import fetchDataFromApi from './api';

import './App.css';

export type AppState = {
  data: DateType | null;
  report: RowData[];
  total: number;
  issues: number;
  month: MonthKeyType;
  year: string;
};

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [isLoading, setIsLoading] = useState(true);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [state, setState] = useState<AppState>({
    data: null,
    report: [],
    total: 0,
    issues: 0,
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
      setIsLoading(true);
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
            issues: reportData.length,
          }));
        }
        } catch (error) {
          console.error('There was a problem with the fetch operations:', error);
        }
        setIsLoading(false);
      };

    fetchData();

    return () => {
      ignore = true; // Отменяем старый запрос при новом эффекте
    };
  }, [state.year]);

  return (
    <ThemeProvider theme={theme}>
      {isLoading && !state.data
        ? <Loader size="s" />
        : <AppLayout
            state={state}
            setState={setState}
            theme={theme}
            toggleTheme={toggleTheme}
          />
      }
    </ThemeProvider>
  )
}

export default App;
