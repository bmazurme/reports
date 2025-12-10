import type { DateType, ReportType } from '@reports/shared';

const BASE_API = 'http://localhost:3000/api';

const fetchDataFromApi = async (year: string): Promise<{
  countsData: DateType;
  reportData: ReportType[];
}> => {
  const countsResponse = await fetch(`${BASE_API}/counts/${year}`);
  const reportResponse = await fetch(`${BASE_API}/reports`);

  if (!countsResponse.ok) {
    throw new Error(`HTTP error fetching counts! status: ${countsResponse.status}`);
  }

  if (!reportResponse.ok) {
    throw new Error(`HTTP error fetching reports! status: ${reportResponse.status}`);
  }

  const { data: countsData } = await countsResponse.json();
  const { data: reportData } = await reportResponse.json();

  return { countsData, reportData };
};

export default fetchDataFromApi;
