import useSWR from 'swr';
import api from '@/lib/utils/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table } from 'antd';

const GenrePage = () => {
  const { data: res = {} } = useSWR<any>(`/api/v1/genres`, api.get);

  const { data: dataSource = [] } = res;

  const columns = [
    {
      title: '流派名称',
      dataIndex: 'name',
    },
  ];

  return (
    <PageContainer ghost>
      <Table columns={columns} dataSource={dataSource} />
    </PageContainer>
  );
};

export default GenrePage;
