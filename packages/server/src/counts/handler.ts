import type { Request, Response } from 'express';
import type { StreamEvent } from '@reports/shared';

import { countWorkAndShortDays } from '../utils/count-work-and-short-days';
import { getProps, addOffDays, removeOffDay } from './props';

export async function handleCounts(req: Request, res: Response) {
  const { id } = req.params;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const sendEvent = (event: StreamEvent) => {
    res.write(JSON.stringify(event) + '\n');
  };

  try {
    const { holidays, shortDays, badDays, offDays } = getProps(id);
    const calendar = countWorkAndShortDays(Number(id), holidays, shortDays, badDays, offDays);

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

export async function handleAddOffDay(req: Request, res: Response) {
  const { id } = req.params;
  const { dates } = req.body;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const sendEvent = (event: StreamEvent) => {
    res.write(JSON.stringify(event) + '\n');
  };

  try {
    const { holidays, shortDays, badDays, offDays } = addOffDays(id, dates);
    const calendar = countWorkAndShortDays(Number(id), holidays, shortDays, badDays, offDays);

    sendEvent({ type: 'message', data: { calendar, holidays, shortDays, badDays, offDays } });
    res.end();
  } catch (error) {
    console.error('Add off day error:', error);
    sendEvent({
      type: 'error',
      data: error instanceof Error ? error.message : 'Unknown error',
    });
    res.end();
  }
}

export async function handleRemoveOffDay(req: Request, res: Response) {
  const { id, date } = req.params;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const sendEvent = (event: StreamEvent) => {
    res.write(JSON.stringify(event) + '\n');
  };

  try {
    const { holidays, shortDays, badDays, offDays } = removeOffDay(id, date);
    const calendar = countWorkAndShortDays(Number(id), holidays, shortDays, badDays, offDays);

    sendEvent({ type: 'message', data: { calendar, holidays, shortDays, badDays, offDays } });
    res.end();
  } catch (error) {
    console.error('Remove off day error:', error);
    sendEvent({
      type: 'error',
      data: error instanceof Error ? error.message : 'Unknown error',
    });
    res.end();
  }
}