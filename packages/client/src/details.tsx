import { TextInput, Text, Select } from '@gravity-ui/uikit';
import type { MonthKeyType, KeyType, DateType } from '@reports/shared';
import { options, fields } from './constants';

import './App.css';
import style from './app.module.css';
import { AppState } from './App';

type DetailProps = {
  total: number;
  month: MonthKeyType;
  data: DateType;
  setState: (value: AppState | ((prevState: AppState) => AppState)) => void;
}

function Details({ month, total, data, setState }: DetailProps) {
  return <div className={style.total}>
    <Text variant="header-2">Details</Text>
    <Select
      label="Month"
      value={[month]}
      className={style.select}
      onUpdate={([t]) => setState((prev: AppState) => ({ ...prev, month: t as MonthKeyType }))}
  
      options={options}
    />
    <div className={style.fields}>
      {Object.entries(fields).map(([key, label]) => 
      <TextInput
        key={key}
        placeholder="0"
        label={label}
        disabled
        value={`${data?.calendar[month][key as KeyType]}`}
      />)}
      <TextInput
        label="Сумма"
        disabled
        errorPlacement="inside"
        validationState="invalid"
        value={`${total}`}
      />
    </div>
  </div>
}

export default Details;
