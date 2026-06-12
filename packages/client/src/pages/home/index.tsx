import type { DateType, MonthKeyType } from '@reports/shared';

import Report from '../../components/report/report';
import Details from '../../components/details/details';
import type { RowData } from '../../hocs/with-table-sorting';

import style from './home.module.css';

type HomeProps = {
  month: MonthKeyType;
  year: string;
  total: number;
  data: DateType;
  issues: number;
  closed: number;
  report: RowData[];
}

function Home({ month, year, total, data, issues, closed, report }: HomeProps) {
  const monthPrefix = `${year}-${month.padStart(2, '0')}`;
  const offDays = data.offDays
    .filter((date) => {
      if (!date.startsWith(monthPrefix) || data.holidays.includes(date)) {
        return false;
      }

      const dayOfWeek = new Date(`${date}T00:00:00Z`).getUTCDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6) && !data.badDays.includes(date);

      return !isWeekend;
    })
    .length;

  return (
    <div className={style.page}>
      <Details
        month={month}
        total={total}
        data={data}
        issues={issues}
        closed={closed}
      />
      <Report report={report} offDays={offDays} />
    </div>
  )
}

export default Home;
