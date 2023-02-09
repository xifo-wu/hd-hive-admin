import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:2027/',
      changeOrigin: true,
    },
  },
  layout: {},
  routes: [
    {
      path: '/admin/user',
      layout: false,
      routes: [
        {
          path: '/admin/user/login',
          component: './Login',
        },
      ],
    },
    {
      path: '/admin',
      redirect: '/admin/home',
    },
    {
      path: '/admin',
      routes: [
        {
          name: '首页',
          hideInMenu: true,
          path: '/admin/home',
          component: './Home',
        },
      ],
    },
    // {
    //   name: '首页',
    //
    //   hideInMenu: true,
    //   component: './Home',
    // },
  ],
  npmClient: 'pnpm',
});
