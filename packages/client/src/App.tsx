import { useEffect, useState } from 'react';
import { Text, Select, Loader } from '@gravity-ui/uikit';
import type { DateType, MonthKeyType } from '@reports/shared';
import { years } from './constants';
import { RowData } from './hocs/with-table-sorting';
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
  const [state, setState] = useState<AppState>({
    data: null,
    report: [],
    total: 0,
    month: '12',
    year: '2025',
  });

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

  return (!state.data
    ? <Loader size="s" />
    : <>
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
  )
}

export default App;
