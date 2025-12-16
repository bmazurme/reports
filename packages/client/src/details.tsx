import {
  TextInput, Text, Select, Progress, ProgressColorStops,
} from '@gravity-ui/uikit';
import type { MonthKeyType, KeyType, DateType } from '@reports/shared';

import { options, fields } from './constants';
import { AppState } from './App';

import './App.css';
import style from './app.module.css';

type DetailProps = {
  total: number;
  issues: number;
  month: MonthKeyType;
  data: DateType;
  closed: number;
  setState: (value: AppState | ((prevState: AppState) => AppState)) => void;
}

const colorStopsConfig: ProgressColorStops[] = [
  { theme: 'danger', stop: 30 },
  { theme: 'warning', stop: 60 },
  { theme: 'success', stop: 100 }
];

function Details({ month, total, issues, data, setState, closed }: DetailProps) {
  const currentMonth = new Date().getMonth() + 1;

  return <div className={style.total}>
    <Text variant="header-2">Details</Text>
    <div className={style.progress}>
      <Progress
        value={currentMonth.toString() === month ? total / data.calendar[month].hours * 100 : 0}
        size="xs"
        colorStops={colorStopsConfig}
      />
    </div>
    <div className={style.grid}>
      <div className={style.fields}>
        <Select
          label="Month"
          value={[month]}
          onUpdate={([t]) => setState((prev: AppState) => ({ ...prev, month: t as MonthKeyType }))}
          options={options}
        />
        {Object.entries(fields).map(([key, label]) => 
          <TextInput
            key={key}
            placeholder="0"
            label={label}
            disabled
            value={`${data?.calendar[month][key as KeyType]}`}
          />)}
      </div>

      <div className={style.fields}>
        <TextInput
          label="Current total"
          disabled
          errorPlacement="inside"
          validationState="invalid"
          value={`${total}`}
        />
        <TextInput
          label="Current issues"
          disabled
          errorPlacement="inside"
          validationState="invalid"
          value={`${issues}`}
        />
        <TextInput
          label="Closed issues"
          disabled
          errorPlacement="inside"
          validationState="invalid"
          value={`${closed}`}
        />
      </div>
    </div>
  </div>
}

export default Details;
