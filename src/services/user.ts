import api from '@/lib/utils/api';
import { history } from '@umijs/max';
import { message } from 'antd';

export interface User {
  id: number;
  created_at: string;
  email: string;
  gravatar_url: string;
  nickname: string;
  updated_at?: string;
  username: string;
}

export const queryCurrentUser = async () => {
  try {
    const { data } = await api.get('/api/v1/user');

    if (!data.is_admin) {
      history.push('/user/login');
      window.localStorage.removeItem('accessToken');
      return;
    }

    return data;
  } catch (error: any) {
    if (error.httpStatus === 401) {
      message.error('登录过期请重新登录');
      window.localStorage.removeItem('accessToken');
      history.push('/user/login');
    }
    return;
  }
};

export const logout = async () => {
  await api.delete('/api/v1/logout');
  window.localStorage.removeItem('accessToken');
  history.push('/user/login');
};
