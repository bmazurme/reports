import type { DateType, MonthKeyType } from '@reports/shared';

import Report from '../../components/report/report';
import Details from '../../components/details/details';
import type { RowData } from '../../hocs/with-table-sorting';

import style from './home.module.css';

type HomeProps = {
  month: MonthKeyType;
  total: number;
  data: DateType;
  issues: number;
  closed: number;
  report: RowData[];
}

function Home({ month, total, data, issues, closed, report }: HomeProps) {
  return (
    <div className={style.page}>
      <Details
        month={month}
        total={total}
        data={data}
        issues={issues}
        closed={closed}
      />
      <Report report={report} />
    </div>
  )
}

export default Home;
