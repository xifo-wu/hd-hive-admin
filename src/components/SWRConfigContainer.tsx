'use client';

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';
import type { AxiosRequestConfig } from 'axios';
import api from '@/lib/utils/api';

interface Props {
  children: ReactNode;
}

interface ArgsProps extends AxiosRequestConfig {
  url: string;
}

async function fetcher(args: ArgsProps) {
  const { url, ...restArgs } = args;
  // TODO 明确 any 类型
  // TODO 到时候 GET 也改成 { response, error } 返回。这时这里需要修改
  // const { response, error } = await api.get<any, any>(url, restArgs);

  try {
    const response = await api.get<any, any>(url, restArgs);
    return response;
  } catch (error) {
    return error;
  }
}

const SWRConfigContainer = ({ children }: Props) => {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigContainer;
