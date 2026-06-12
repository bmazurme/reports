import { Text, Button } from '@gravity-ui/uikit';
import type { MonthKeyType } from '@reports/shared';

import { columns } from '../../constants';
import MyTable, { RowData } from '../../hocs/with-table-sorting';
import { reportSelector, settingsSelector } from '../../store';
import { useAppSelector } from '../../hooks';
import { exportReport } from '../../utils/export-report';

import style from '../../app.module.css';
import reportStyle from './report.module.css';

function Report({ report, offDays }: { report: RowData[]; offDays: number }) {
  const { month, year } = useAppSelector(reportSelector);
  const { employee, company } = useAppSelector(settingsSelector);

  const handleExport = () => {
    exportReport({
      report,
      month: month as MonthKeyType,
      year,
      employee,
      company,
      offDays,
    });
  };

  return (
    <div className={style.report}>
      <div className={reportStyle.header}>
        <Text variant="header-2">Report</Text>
        <Button view="normal" size="m" onClick={handleExport}>
          Export
        </Button>
      </div>
      <div className={reportStyle.card}>
        <MyTable
          data={report}
          columns={columns}
          width="max"
          verticalAlign="middle"
          edgePadding
        />
      </div>
    </div>
  )
}

export default Report;
