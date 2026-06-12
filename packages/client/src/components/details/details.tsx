import {
  TextInput, Text, Progress, ProgressColorStops,
} from '@gravity-ui/uikit';
import type { MonthKeyType, KeyType, DateType } from '@reports/shared';

import { fields } from '../../constants';

import appStyle from '../../app.module.css';
import style from './details.module.css';

type DetailProps = {
  total: number;
  issues: number;
  month: MonthKeyType;
  data: DateType;
  closed: number;
}

const colorStopsConfig: ProgressColorStops[] = [
  { theme: 'danger', stop: 30 },
  { theme: 'warning', stop: 60 },
  { theme: 'success', stop: 100 }
];

function Details({ month, total, issues, data, closed }: DetailProps) {
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
    <div className={appStyle.grid}>
      <div className={style.fields}>
        {Object.entries(fields)
          .filter(([key]) => !['weekends', 'offDays', 'holidays', 'shortDays', 'workDays', 'hours'].includes(key))
          .map(([key, label]) =>
            <TextInput
              key={key}
              placeholder="0"
              label={label}
              disabled
              value={`${data?.calendar[month][key as KeyType]}`}
            />)}
        <div className={style.row}>
          {(['offDays', 'holidays', 'shortDays'] as const).map((key) =>
            <TextInput
              key={key}
              placeholder="0"
              label={fields[key]}
              disabled
              value={`${data?.calendar[month][key]}`}
            />)}
        </div>
        <div className={style.row}>
          {(['weekends', 'workDays', 'hours'] as const).map((key) =>
            <TextInput
              key={key}
              placeholder="0"
              label={fields[key]}
              disabled
              value={`${data?.calendar[month][key]}`}
            />)}
        </div>
      </div>

      <div className={style.fields}>
        <TextInput
          label="Current total hours"
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
