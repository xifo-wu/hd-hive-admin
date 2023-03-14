import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  hash: true,
  initialState: {},
  request: {},
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:2027/',
      changeOrigin: true,
    },
  },
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  title: '影巢 - HD Hive',
  layout: {},
  routes,
  npmClient: 'pnpm',
});
