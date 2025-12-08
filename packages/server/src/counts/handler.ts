import type { Request, Response } from 'express';
import type { StreamEvent } from '@reports/shared';

import { countWorkAndShortDays } from '../utils/count-work-and-short-days';
import { props } from './props';

export async function handleCounts(req: Request, res: Response) {
  const sendEvent = (event: StreamEvent) => {
    res.write(JSON.stringify(event) + '\n');
  };

  try {
    const { holidays, shortDays, badDays, offDays } = props[2025];
    const calendar = countWorkAndShortDays(2025, holidays, shortDays, badDays, offDays);

    sendEvent({ type: 'message', data: { calendar, holidays, shortDays, badDays, offDays } });
    res.end();
  } catch (error) {
    console.error('Counts error:', error);
    sendEvent({
      type: 'error',
      data: error instanceof Error ? error.message : 'Unknown error',
    });
    res.end();
  }
}