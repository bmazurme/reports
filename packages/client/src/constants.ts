import { TableColumnConfig } from '@gravity-ui/uikit';
import type { KeyType } from '@reports/shared';
import { RowData } from './hocs/with-table-sorting';

export const options = [
  { value: '1', content: 'January' },
  { value: '2', content: 'February' },
  { value: '3', content: 'March' },
  { value: '4', content: 'April' },
  { value: '5', content: 'May' },
  { value: '6', content: 'June' },
  { value: '7', content: 'July' },
  { value: '8', content: 'August' },
  { value: '9', content: 'September' },
  { value: '10', content: 'October' },
  { value: '11', content: 'November' },
  { value: '12', content: 'December' },
];
export const years = [
  { value: '2025', content: '2025' },
  { value: '2026', content: '2026' },
];

export const fields: Record<KeyType, string> = {
  allDays: 'All days',
  holidays: 'Holidays',
  weekends: 'Weekends',
  offDays: 'Off days',
  shortDays: 'Short days',
  workDays: 'workDays',
  hours: 'Hours'
};

export const columns: TableColumnConfig<RowData>[] = [
  { id: 'name', name: 'Наименование задачи', align: 'start', meta: { sort: true } },
  { id: 'status', name: 'Статус задачи', align: 'center', meta: { sort: true } },
  { id: 'time', name: 'Часы', align: 'center', meta: { sort: true } },
];
