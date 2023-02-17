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
  title: '影巢 - HD Hive',
  layout: {},
  routes: [
    {
      path: '/admin/user',
      layout: false,
      routes: [
        {
          path: '/admin/user/login',
          name: '影巢登录',
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
      flatMenu: true,
      routes: [
        {
          name: '首页',
          hideInMenu: true,
          path: '/admin/home',
          component: './Home',
        },
        {
          name: '资源分享',
          icon: 'cloud',
          path: '/admin/share',
          component: './Share',
        },
      ],
    },
    // {
    //   name: '资源分享',
    //   path: '/admin/share',
    //   component: './Share',
    // }
  ],
  npmClient: 'pnpm',
});
