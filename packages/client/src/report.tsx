import { Text } from '@gravity-ui/uikit';

import { columns } from './constants';
import MyTable, { RowData } from './hocs/with-table-sorting';

import './App.css';
import style from './app.module.css';

function Report({ report }: { report: RowData[] }) {
  return (
    <div className={style.report}>
      <Text variant="header-2">Report</Text>
      <MyTable
        data={report}
        columns={columns}
      />
    </div>
  )
}

export default Report;
