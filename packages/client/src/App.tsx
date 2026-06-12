import { ThemeProvider } from '@gravity-ui/uikit';
import { Provider } from 'react-redux';

import { useTheme } from './hooks/use-theme';
import AppLayout from './app-layout';
import Content from './components/content';

import { store } from './store';

import './App.css';

function App() {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Content sidebar main={<AppLayout />} />
      </ThemeProvider>
    </Provider>
  )
}

export default App;
