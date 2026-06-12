import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export type YearProps = {
  holidays: string[];
  shortDays: string[];
  badDays: string[];
  offDays: string[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const propsPath = join(__dirname, 'props.json');

const readProps = (): Record<string, YearProps> => {
  return JSON.parse(readFileSync(propsPath, 'utf-8'));
};

export const getProps = (year: number | string | string[]): YearProps => {
  const props = readProps();

  return props[String(year)];
};

export const addOffDays = (year: number | string | string[], dates: string[]): YearProps => {
  const props = readProps();
  const yearProps = props[String(year)];

  const newDates = dates.filter((date) => !yearProps.offDays.includes(date));

  if (newDates.length > 0) {
    yearProps.offDays.push(...newDates);
    writeFileSync(propsPath, JSON.stringify(props, null, 2) + '\n');
  }

  return yearProps;
};

export const removeOffDay = (year: number | string | string[], date: string | string[]): YearProps => {
  const props = readProps();
  const yearProps = props[String(year)];
  const dateStr = String(date);

  if (yearProps.offDays.includes(dateStr)) {
    yearProps.offDays = yearProps.offDays.filter((d) => d !== dateStr);
    writeFileSync(propsPath, JSON.stringify(props, null, 2) + '\n');
  }

  return yearProps;
};
