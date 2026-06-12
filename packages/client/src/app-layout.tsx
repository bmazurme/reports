import { Loader } from '@gravity-ui/uikit';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import CalendarPage from './pages/calendar';
import Settings from './pages/settings';
import { useGetCountsQuery, useGetReportsQuery } from './store/api';
import { reportSelector } from './store';
import { useAppSelector } from './hooks';

import './App.css';
import style from './app.module.css';

function AppLayout() {
  const state = useAppSelector(reportSelector);

  const { data, isLoading: isCountsLoading } = useGetCountsQuery(state.year);
  const { data: reportData, isLoading: isReportsLoading } = useGetReportsQuery();

  if ((isCountsLoading || isReportsLoading) && (!data || !reportData)) {
    return (
      <div className={style.loader}>
        <Loader size="s" />
      </div>
    );
  }

  const report = (reportData ?? []).map((x, i) => ({
    ...x,
    id: i.toString(),
    meta: { sort: true },
  }));
  const total = (reportData ?? []).reduce((a, x) => a + x.time, 0);
  const issues = (reportData ?? []).length;
  const closed = (reportData ?? []).reduce((a, x) => a + (x.status === 'Закрыта' ? 1 : 0), 0);

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <Home
            month={state.month}
            year={state.year}
            total={total}
            data={data!}
            issues={issues}
            closed={closed}
            report={report}
          />
        )}
      />
      <Route
        path="/calendar"
        element={<CalendarPage data={data!} year={state.year} />}
      />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default AppLayout;
