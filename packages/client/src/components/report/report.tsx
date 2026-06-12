import { Text, Button } from '@gravity-ui/uikit';
import type { MonthKeyType } from '@reports/shared';

import { columns } from '../../constants';
import MyTable, { RowData } from '../../hocs/with-table-sorting';
import { reportSelector, settingsSelector } from '../../store';
import { useGetCountsQuery, useGetReportsQuery } from '../../store/api';
import { useAppSelector } from '../../hooks';
import { exportReport } from '../../utils/export-report';

import style from '../../app.module.css';
import reportStyle from './report.module.css';

function Report({ report, offDays }: { report: RowData[]; offDays: number }) {
  const { month, year } = useAppSelector(reportSelector);
  const { employee, company } = useAppSelector(settingsSelector);
  const { refetch: refetchCounts } = useGetCountsQuery(year);
  const { refetch: refetchReports } = useGetReportsQuery();

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

  const handleRefresh = () => {
    refetchCounts();
    refetchReports();
  };

  return (
    <div className={style.report}>
      <div className={reportStyle.header}>
        <Text variant="header-2">Report</Text>
        <div className={reportStyle.actions}>
          <Button view="normal" size="m" onClick={handleRefresh}>
            Refresh data
          </Button>
          <Button view="normal" size="m" onClick={handleExport}>
            Export
          </Button>
        </div>
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
