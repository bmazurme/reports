
import { Calendar } from '@gravity-ui/date-components';
import { DateTime, dateTimeParse } from '@gravity-ui/date-utils';

import './App.css';
import style from './app.module.css';
import { DateType } from '@reports/shared';


function MyCalendar({ data, year }: { data: DateType; year: string }) {
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

  return <div className="calendar">
    <div className={style.grid}>
      {Object.keys(data.calendar).map((month) => {
        const monthNum = Number(month);
        const minDate = dateTimeParse(new Date(`${year}-${monthNum}-01`));
        const maxDate = dateTimeParse(new Date(`${year}-${monthNum}-${getLastDayOfMonth(Number(year), monthNum)}`));

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
  </div>
}

export default MyCalendar;
