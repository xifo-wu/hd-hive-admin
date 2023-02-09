import { ConfigProvider } from 'antd';

const theme = {
  token: {
    colorPrimary: '#faad14',
  },
};

const ThemeProvider = ({ children }: any) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};

export default ThemeProvider;
