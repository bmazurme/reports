
import { useState } from 'react';

import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Text } from '@gravity-ui/uikit';
import { RangeDatePicker, type RangeValue } from '@gravity-ui/date-components';
import { DateTime, dateTimeParse } from '@gravity-ui/date-utils';
import { DateType } from '@reports/shared';

import { useAddOffDaysMutation, useRemoveOffDayMutation } from '../../store/api';

import CalendarMonth from './calendar-month';
import style from './calendar.module.css';

function MyCalendar({ data, year }: { data: DateType; year: string }) {
  const [addOffDays] = useAddOffDaysMutation();
  const [removeOffDay] = useRemoveOffDayMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<RangeValue<DateTime> | null>(null);
  const [dayToRemove, setDayToRemove] = useState<string | null>(null);

  const offDays = data.offDays;

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

    if (offDays.includes(dateStr)) {
      return true;
    }

    if ((dayOfWeek === 0 || dayOfWeek === 6) && !data.badDays.includes(dateStr)) {
      return true;
    }

    return data.holidays.includes(dateStr);
  });

  const handleAddDayOff = () => {
    if (selectedRange?.start && selectedRange?.end) {
      const dates: string[] = [];
      let current = selectedRange.start;

      while (!current.startOf('day').isAfter(selectedRange.end.startOf('day'))) {
        dates.push(`${current.year()}-${String(current.month() + 1).padStart(2, '0')}-${String(current.date()).padStart(2, '0')}`);
        current = current.add(1, 'day');
      }

      addOffDays({ year, dates });
    }

    setIsDialogOpen(false);
    setSelectedRange(null);
  };

  const handleRemoveOffDay = () => {
    if (dayToRemove) {
      removeOffDay({ year, date: dayToRemove });
    }

    setDayToRemove(null);
  };

  return <div className={style.page}>
    <div className={style.main}>
      <div className={style.header}>
        <Text variant="header-2">Calendar</Text>
      </div>
      <div className={style.grid}>
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
              offDays={offDays}
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
    <div className={style.side}>
      <div className={style.addRow}>
        <Button view="action" size="m" onClick={() => setIsDialogOpen(true)}>
          Add day off
        </Button>
        <Text variant="body-2" color="secondary">
          Всего: {offDays.length}
        </Text>
      </div>
      <div className={style.offDaysList}>
        {[...offDays].sort().map((date) => (
          <button
            key={date}
            type="button"
            className={style.offDaysItem}
            onClick={() => setDayToRemove(date)}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
      <DialogHeader caption="Add day off" />
      <DialogBody>
        <RangeDatePicker value={selectedRange} onUpdate={setSelectedRange} />
      </DialogBody>
      <DialogFooter
        onClickButtonCancel={() => setIsDialogOpen(false)}
        onClickButtonApply={handleAddDayOff}
        textButtonApply="Add"
        textButtonCancel="Cancel"
        propsButtonApply={{ disabled: !selectedRange?.start || !selectedRange?.end }}
      />
    </Dialog>
    <Dialog open={!!dayToRemove} onClose={() => setDayToRemove(null)}>
      <DialogHeader caption="Remove day off" />
      <DialogBody>
        Удалить {dayToRemove} из дополнительных выходных?
      </DialogBody>
      <DialogFooter
        onClickButtonCancel={() => setDayToRemove(null)}
        onClickButtonApply={handleRemoveOffDay}
        textButtonApply="Remove"
        textButtonCancel="Cancel"
      />
    </Dialog>
  </div>
}

export default MyCalendar;
