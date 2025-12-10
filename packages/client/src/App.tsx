import { useEffect, useState } from 'react';
import { Calendar } from '@gravity-ui/date-components';
import { dateTimeParse, type DateTime } from '@gravity-ui/date-utils';
import { TextInput, Text, Select, Loader, TableColumnConfig } from '@gravity-ui/uikit';
import type { DateType, MonthKeyType, KeyType } from '@reports/shared';
import { options } from './constants';
import MyTable, { RowData } from './hocs/with-table-sorting';

import './App.css';
import style from './app.module.css';

const fields: Record<KeyType, string> = {
  allDays: 'All days',
  holidays: 'Holidays',
  weekends: 'Weekends',
  offDays: 'Off days',
  shortDays: 'Short days',
  workDays: 'workDays',
  hours: 'Hours'
};

function App({ year = 2025 }: { year?: number; }) {
  const [data, setData] = useState<DateType | null>(null);
  const [report, setReport] = useState([]);
  const [total, setTotal] = useState(0);
  const [month, setMonth] = useState<MonthKeyType>('12');
  const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  const isWeekendOrHoliday = ((t: DateTime) => {
    const y = t.year();
    const m = t.month();
    const d = t.date();
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = new Date(Date.UTC(y, m, d)).getUTCDay();

    if (!data) {
      return false;
    }

    if (data.offDays.includes(dateStr)) {
      return true;
    }

    if ((dayOfWeek === 0 || dayOfWeek === 6) && !data.badDays.includes(dateStr)) {
      return true;
    }

    return data.holidays.includes(dateStr);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countsResponse, reportResponse] = await Promise.all([
          fetch('http://localhost:3000/api/counts'),
          fetch('http://localhost:3000/api/reports'),
        ]);

        if (!countsResponse.ok) {
          throw new Error(`HTTP error fetching counts! status: ${countsResponse.status}`);
        }
        if (!reportResponse.ok) {
          throw new Error(`HTTP error fetching reports! status: ${reportResponse.status}`);
        }

        const { data: countsData } = await countsResponse.json();
        const { data: reportData } = await reportResponse.json();

        setData(countsData);
        setReport(reportData);
        setTotal(reportData.reduce((a: number, x: { time: number }) => a + x.time, 0))
      } catch (error) {
        console.error('There was a problem with the fetch operations:', error);
      }
    };

    fetchData();
  }, []);

  const columns: TableColumnConfig<RowData>[] = [
    { id: 'name', name: 'Наименование задачи', align: 'left', meta: { sort: true } },
    { id: 'status', name: 'Статус задачи', align: 'center', meta: { sort: true } },
    { id: 'time', name: 'Часы', align: 'center', meta: { sort: true } },
  ];

  return (!data ? <Loader size="s" /> :
    <>
      <Text variant="display-3">{year}</Text>
      {data &&
        <div className="calendar">
          <div className={style.grid}>
          {Object.keys(data.calendar).map((month) => {
            const monthNum = Number(month);
            const minDate = dateTimeParse(new Date(`${year}-${monthNum}-01`));
            const maxDate = dateTimeParse(new Date(`${year}-${monthNum}-${getLastDayOfMonth(year, monthNum)}`));

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

      {data &&
      <div className={style.total}>
        <Text variant="header-2">Details</Text>
        <Select
          label="Month"
          value={[month]}
          className={style.select}
          onUpdate={([t]) => setMonth(t as MonthKeyType)}
          options={options}
        />
        <div className={style.fields}>
          {Object.entries(fields).map(([key, label]) => <TextInput
            key={key}
            placeholder="0"
            label={label}
            disabled
            value={`${data.calendar[month][key as KeyType]}`}
          />)}
          <TextInput
            label="Сумма"
            disabled
            errorPlacement="inside"
            validationState="invalid"
            value={`${total}`}
          />
        </div>
      </div>}
      <div className={style.total}>
        <MyTable
          data={report}
          columns={columns}
        />
      </div>
    </>
  )
}

export default App;
