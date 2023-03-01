// 运行时配置
import React from 'react';
import { history } from '@umijs/max';
import { LogoutOutlined } from '@ant-design/icons';
import { logout, queryCurrentUser, User } from './services/user';
import ThemeProvider from './components/ThemeProvider';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Tooltip } from 'antd';

const loginPath = '/user/login';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  queryCurrentUser?: () => Promise<User>;
  currentUser?: User;
}> {
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await queryCurrentUser();
    return {
      queryCurrentUser,
      currentUser,
    };
  }

  return { queryCurrentUser };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  const { currentUser = {} } = initialState as any;

  return {
    logo: '/logo.png',
    title: 'HD Hive',
    avatarProps: {
      src: currentUser.gravatar_url,
      size: 'small',
      title: currentUser.nickname,
    },
    // 自定义渲染菜单 Logo 和 title
    menuHeaderRender: (logo, title) => {
      return (
        <>
          {logo}
          <div className="menu-title">{title}</div>
        </>
      );
    },
    actionsRender: () => {
      return [
        <Tooltip key="lagout" title="退出登录">
          <LogoutOutlined onClick={logout} />
        </Tooltip>,
      ];
    },
    menu: {
      locale: false,
    },
    rightContentRender: () => <></>,
    onMenuHeaderClick: () => {
      history.push('/home');
    },
  };
};

export function rootContainer(container: any) {
  return React.createElement(ThemeProvider, null, container);
}
