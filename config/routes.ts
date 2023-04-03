export default [
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
        icon: 'shareAlt',
        path: '/resources',
        routes: [
          {
            name: '电影管理',
            path: '/resources/movies',
            component: './Movie',
          },
          {
            name: '剧集管理',
            path: '/resources/tv',
            component: './TV',
            meta: {
              recordType: 'tv',
              recordName: '剧集',
            },
          },
          {
            name: '动漫管理',
            path: '/resources/animes',
            component: './TV',
            meta: {
              recordType: 'anime',
              recordName: '动漫',
            },
          },
          {
            name: '综艺管理',
            path: '/resources/zongyi',
            component: './TV',
            meta: {
              recordType: 'zongyi',
              recordName: '综艺',
            },
          },
          {
            name: '纪录片管理',
            path: '/resources/documentary',
            component: './TV',
            meta: {
              recordType: 'documentary',
              recordName: '纪录片',
            },
          },
        ],
      },
      {
        name: '资源分享',
        icon: 'cloud',
        path: '/share',
        component: './Share',
      },
      {
        name: '用户管理',
        icon: 'team',
        path: '/users',
        component: './User',
      },
      {
        name: '流派管理',
        icon: 'nodeIndex',
        path: '/genre',
        component: './Genre',
      },
      {
        name: '系统配置',
        icon: 'setting',
        path: '/system-setting',
        component: './SystemSeting',
      },
    ],
  },
];
