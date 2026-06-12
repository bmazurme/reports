import { createApi, retry } from '@reduxjs/toolkit/query/react';
import type { DateType, ReportType, StreamEvent } from '@reports/shared';

import baseQuery from '../../base-query';

export const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Counts', 'Reports'],
  endpoints: (builder) => ({
    getCounts: builder.query<DateType, string>({
      query: (year) => `counts/${year}`,
      transformResponse: (response: StreamEvent) => response.data as DateType,
      providesTags: ['Counts'],
    }),
    getReports: builder.query<ReportType[], void>({
      query: () => 'reports',
      transformResponse: (response: StreamEvent) => response.data as ReportType[],
      providesTags: ['Reports'],
    }),
  }),
});

export const { useGetCountsQuery, useGetReportsQuery } = reportsApi;
export default reportsApi;
