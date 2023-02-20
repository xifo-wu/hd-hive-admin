import { defineConfig } from '@umijs/max';

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
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          name: '影巢登录',
          component: './Login',
        },
      ],
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/',
      flatMenu: true,
      routes: [
        {
          name: '首页',
          hideInMenu: true,
          path: '/home',
          component: './Home',
        },
        {
          name: '资源分享',
          icon: 'cloud',
          path: '/share',
          component: './Share',
        },
        {
          name: '系统配置',
          icon: 'setting',
          path: '/system-setting',
          component: './SystemSeting',
        },
      ],
    },
  ],
  npmClient: 'pnpm',
});
