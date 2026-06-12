import { Text } from '@gravity-ui/uikit';

import { columns } from '../../constants';
import MyTable, { RowData } from '../../hocs/with-table-sorting';

import style from '../../app.module.css';
import reportStyle from './report.module.css';

function Report({ report }: { report: RowData[] }) {
  return (
    <div className={style.report}>
      <Text variant="header-2">Report</Text>
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
