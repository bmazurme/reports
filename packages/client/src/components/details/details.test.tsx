import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@gravity-ui/uikit';
import type { DateType, MonthType } from '@reports/shared';

import Details from './details';

const emptyMonth: MonthType = {
  allDays: 0,
  holidays: 0,
  weekends: 0,
  offDays: 0,
  shortDays: 0,
  workDays: 0,
  hours: 0,
};

const buildData = (hours: number): DateType => ({
  calendar: Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [String(i + 1), { ...emptyMonth, hours }]),
  ) as DateType['calendar'],
  holidays: [],
  shortDays: [],
  badDays: [],
  offDays: [],
});

const renderDetails = (props: Parameters<typeof Details>[0]) =>
  render(
    <ThemeProvider theme="light">
      <Details {...props} />
    </ThemeProvider>,
  );

describe('Details', () => {
  it('does not show an error when total hours are within the limit', () => {
    renderDetails({
      month: '1',
      total: 100,
      issues: 5,
      closed: 2,
      data: buildData(160),
    });

    expect(screen.getByDisplayValue('100')).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('shows an error message when total hours exceed the month limit', () => {
    const { container } = renderDetails({
      month: '1',
      total: 200,
      issues: 5,
      closed: 2,
      data: buildData(160),
    });

    expect(screen.getByDisplayValue('200')).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelector('[data-qa="control-error-icon-qa"]')).toBeInTheDocument();
  });
});
