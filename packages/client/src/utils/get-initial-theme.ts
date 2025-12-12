export const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : 'light';
  } catch (e) {
    console.error('Failed to get theme from localStorage', e);
    return 'light';
  }
};
