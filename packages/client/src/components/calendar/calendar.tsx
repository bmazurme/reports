
import { useLayoutEffect, useRef } from 'react';

import { Calendar } from '@gravity-ui/date-components';
import { DateTime, dateTimeParse } from '@gravity-ui/date-utils';
import { DateType } from '@reports/shared';

import appStyle from '../../app.module.css';
import style from './calendar.module.css';

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
    <div className={appStyle.grid}>
      {Object.keys(data.calendar).map((month) => {
        const monthNum = Number(month);
        const minDate = dateTimeParse(new Date(`${year}-${monthNum}-01`))!;
        const maxDate = dateTimeParse(new Date(`${year}-${monthNum}-${getLastDayOfMonth(Number(year), monthNum)}`))!;

        return (
          <CalendarMonth
            key={month}
            minDate={minDate}
            maxDate={maxDate}
            isWeekendOrHoliday={isWeekendOrHoliday}
            shortDays={data.shortDays}
            holidays={data.holidays}
            offDays={data.offDays}
            year={year}
            month={monthNum}
            lastDay={getLastDayOfMonth(Number(year), monthNum)}
          />
        )
      })}
    </div>
    <div className={style.legend}>
      <div className={style.legendItem}>
        <span className={`${style.legendColor} ${style.shortDay}`} />
        Короткий день
      </div>
      <div className={style.legendItem}>
        <span className={`${style.legendColor} ${style.holiday}`} />
        Праздник
      </div>
      <div className={style.legendItem}>
        <span className={`${style.legendColor} ${style.offDay}`} />
        Отпуск/отгул/больничный
      </div>
    </div>
  </div>
}

function CalendarMonth({ minDate, maxDate, isWeekendOrHoliday, shortDays, holidays, offDays, year, month, lastDay }: {
  minDate: DateTime;
  maxDate: DateTime;
  isWeekendOrHoliday: (t: DateTime) => boolean;
  shortDays: string[];
  holidays: string[];
  offDays: string[];
  year: string;
  month: number;
  lastDay: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const buttons = containerRef.current?.querySelectorAll<HTMLElement>(
      '.g-date-calendar__current-state .g-date-calendar__button:not(.g-date-calendar__button_out-of-boundary)'
    );

    buttons?.forEach((button, index) => {
      const day = index + 1;
      if (day > lastDay) {
        return;
      }

      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isShortDay = shortDays.includes(dateStr);
      const isHoliday = holidays.includes(dateStr);

      button.classList.toggle(style.shortDay, isShortDay);
      button.classList.toggle(style.holiday, isHoliday);
      button.classList.toggle(style.offDay, offDays.includes(dateStr) && !isShortDay && !isHoliday);
    });
  });

  return (
    <div
      className={style.item}
      ref={containerRef}>
      <Calendar
        mode="days"
        size="m"
        focusedValue={minDate}
        minValue={minDate}
        maxValue={maxDate}
        isWeekend={isWeekendOrHoliday}
      />
    </div>
  )
}

export default MyCalendar;
