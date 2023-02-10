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

    return data;
  } catch (error: any) {
    if (error.httpStatus === 401) {
      message.error('登录过期请重新登录');
      history.push('/admin/user/login');
    }

    return;
  }
};

export const logout = async () => {
  await api.delete('/api/v1/logout');
  history.push('/admin/user/login');
};
