import { useEffect, useState } from 'react';
import { Calendar } from '@gravity-ui/date-components';
import { dateTimeParse, type DateTime } from '@gravity-ui/date-utils';
import { TextInput, Text, Select } from '@gravity-ui/uikit';
import { options } from './constants';

import './App.css';
import style from './app.module.css';

type MonthType = {
  allDays: number;
  holidays: number;
  weekends: number;
  offDays: number;
  shortDays: number;
  workDays: number;
  hours: number;
}

type MonthKeyType = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

type DateType = {
  calendar: Record<MonthKeyType, MonthType>;
  holidays: string[];
  shortDays: string[];
  badDays: string[];
  offDays: string[];
}

function App({ year = 2025 }
  : { year?: number; }) {
  const [data, setData] = useState<DateType | null>(null);
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
    fetch('http://localhost:3000/api/counts')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(({ data }) => {
        setData(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  return (
    <>
      <Text variant="display-3">{year}</Text>

      {data &&
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
          <TextInput
            placeholder="0"
            label="All days"
            disabled
            value={`${data.calendar[month].allDays}`}
          />
          <TextInput
            placeholder="0"
            label="Holidays"
            disabled
            value={`${data.calendar[month].holidays}`}
          />
          <TextInput
            placeholder="0"
            label="Weekends"
            disabled
            value={`${data.calendar[month].weekends}`}
          />
          <TextInput
            placeholder="0"
            label="Off days"
            disabled
            value={`${data.calendar[month].offDays}`}
          />
          <TextInput
            placeholder="0"
            label="Short days"
            disabled
            value={`${data.calendar[month].shortDays}`}
          />
          <TextInput
            placeholder="0"
            label="Work days"
            disabled
            value={`${data.calendar[month].workDays}`}
          />
          <TextInput
            placeholder="0"
            label="Hours"
            disabled
            value={`${data.calendar[month].hours}`}
          />
        </div>
      </div>}
    </>
  )
}

export default App;
