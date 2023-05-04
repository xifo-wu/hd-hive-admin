import useSWR from 'swr';
import qs from 'qs';
import { useSearchParams } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Table } from 'antd';
import api from '@/lib/utils/api';
import MoreActions from './components/MoreActions';
import _ from 'lodash';
import CreatChangeLogModalForm from './components/CreatChangeLogModalForm';
import useModal from '@/lib/hooks/useModal';
import UpdateChangeLogModalForm from './components/UpdateChangeLogModalForm';

const searchParamsToObject = (searchParams: URLSearchParams) => {
  const object: Record<string, string> = {};
  for (const [key, value] of searchParams) {
    object[key] = value;
  }

  return object;
};

const User = () => {
  const { openModal } = useModal<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParamsToObject(searchParams);
  const {
    data: res = {},
    isLoading,
    isValidating,
    mutate,
  } = useSWR<any>(
    `/api/v1/manager/change-logs?${searchParams.toString()}`,
    api.get,
  );

  const { data: dataSource = [], meta = {} } = res;

  const handleTableChange = (
    pagination: any,
    _filters: any,
    sorter: any,
    { action }: any,
  ) => {
    if (action === 'paginate') {
      setSearchParams({
        ...query,
        page: pagination.current,
        per_page: pagination.pageSize,
      });

      return;
    }

    if (action === 'sort') {
      const sortBy = Array.isArray(sorter.field)
        ? _.last(sorter.field)
        : sorter.field;
      const sortOrder = sorter.order;

      setSearchParams(
        qs.stringify({
          ...query,
          sort_by: sortOrder ? sortBy : undefined,
          sort_order: sortOrder,
        }),
      );

      return;
    }
  };

  const columns = [
    {
      title: '版本',
      dataIndex: 'version',
    },
    {
      title: '内容',
      dataIndex: 'content',
    },
    {
      title: '操作',
      render: (record: any) => (
        <MoreActions record={record} reloadData={() => mutate()} />
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      extra={[
        <Button
          key="add"
          type="primary"
          onClick={() => openModal('CreatChangeLogModalForm')}
        >
          创建版本
        </Button>,
      ]}
    >
      <Card bordered={false}>
        <Table
          pagination={{
            current: meta.page,
            pageSize: meta.per_page,
            total: meta.total,
            showSizeChanger: true,
          }}
          loading={isLoading || isValidating}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          // @ts-ignore 加个 fixed right 就报错。无语 😓
          columns={columns}
          dataSource={dataSource}
          onChange={handleTableChange}
        />
      </Card>

      <CreatChangeLogModalForm onFinish={() => mutate()} />
      <UpdateChangeLogModalForm onFinish={() => mutate()} />
    </PageContainer>
  );
};

export default User;
