import { message } from 'antd';
import useSWR from 'swr';

export default function useUser() {
  const { data: response = {}, error } = useSWR({
    url: '/api/v1/user',
  });

  if (error) {
    message.error('获取当前用户失败');
    return;
  }

  return response.data;
}
