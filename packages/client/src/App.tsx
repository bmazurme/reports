import { useEffect, useState } from 'react';
import { Calendar } from '@gravity-ui/date-components';
import { dateTimeParse, type DateTime } from '@gravity-ui/date-utils';
import { TextInput, Text, Select, Loader } from '@gravity-ui/uikit';
import type { DateType, MonthKeyType, KeyType } from '@reports/shared';
import { options, fields, columns, years } from './constants';
import MyTable, { RowData } from './hocs/with-table-sorting';

import fetchDataFromApi from './api';

import './App.css';
import style from './app.module.css';

type AppState = {
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
  const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  const isWeekendOrHoliday = ((t: DateTime) => {
    const y = t.year();
    const m = t.month();
    const d = t.date();
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = new Date(Date.UTC(y, m, d)).getUTCDay();

    if (!state.data) {
      return false;
    }

    if (state.data.offDays.includes(dateStr)) {
      return true;
    }

    if ((dayOfWeek === 0 || dayOfWeek === 6) && !state.data.badDays.includes(dateStr)) {
      return true;
    }

    return state.data.holidays.includes(dateStr);
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

  return (!state.data ? <Loader size="s" /> :
    <>
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
      {state.data &&
        <div className="calendar">
          <div className={style.grid}>
          {Object.keys(state.data.calendar).map((month) => {
            const monthNum = Number(month);
            const minDate = dateTimeParse(new Date(`${state.year}-${monthNum}-01`));
            const maxDate = dateTimeParse(new Date(`${state.year}-${monthNum}-${getLastDayOfMonth(Number(state.year), monthNum)}`));

            return (
              <div
                className={style.item}
                key={month}>
                <Calendar
                  mode="days"
                  size="m"
                  focusedValue={minDate}
                  minValue={minDate}
                  maxValue={maxDate}
                  isWeekend={isWeekendOrHoliday}
                />
              </div>)
            })}
        </div>
      </div>}

      {state.data &&
      <div className={style.total}>
        <Text variant="header-2">Details</Text>
        <Select
          label="Month"
          value={[state.month]}
          className={style.select}
          onUpdate={([t]) => setState((prev) => ({ ...prev, month: t as MonthKeyType }))}
          options={options}
        />
        <div className={style.fields}>
          {Object.entries(fields).map(([key, label]) => 
          <TextInput
            key={key}
            placeholder="0"
            label={label}
            disabled
            value={`${state?.data?.calendar[state.month][key as KeyType]}`}
          />)}
          <TextInput
            label="Сумма"
            disabled
            errorPlacement="inside"
            validationState="invalid"
            value={`${state.total}`}
          />
        </div>
      </div>}
      <div className={style.report}>
        <Text variant="header-2">Report</Text>
        <MyTable
          data={state.report}
          columns={columns}
        />
      </div>
    </>
  )
}

export default App;
