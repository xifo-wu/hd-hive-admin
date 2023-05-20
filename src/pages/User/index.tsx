import useSWR from 'swr';
import qs from 'qs';
import { useSearchParams } from '@umijs/max';
import {
  ProFormText,
  QueryFilter,
  PageContainer,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Card, Space, Table, Typography } from 'antd';
import api from '@/lib/utils/api';
import MoreActions from './components/MoreActions';
import _ from 'lodash';

const searchParamsToObject = (searchParams: URLSearchParams) => {
  const object: Record<string, string> = {};
  for (const [key, value] of searchParams) {
    object[key] = value;
  }

  return object;
};

const User = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParamsToObject(searchParams);
  const {
    data: res = {},
    isLoading,
    isValidating,
    mutate,
  } = useSWR<any>(`/api/v1/manager/users?${searchParams.toString()}`, api.get);

  const { data: dataSource = [], meta = {} } = res;

  const handleSearch = async (values: any) => {
    setSearchParams(values);
  };

  const handleReset = () => {
    setSearchParams({});
  };

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
      title: '头像',
      dataIndex: 'gravatar_url',
      render: (v: string) => {
        return <img src={v} width={32} />;
      },
    },
    {
      title: 'UID',
      dataIndex: 'id',
      render: (value: number, record: Record<string, any>) => {
        if (record.is_block) {
          return (
            <span>
              {value}
              <span style={{ color: '#ef4444' }}>(已封禁)</span>
            </span>
          );
        }
        return value;
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '管理员',
      dataIndex: 'is_admin',
      render: (v: boolean) => (v ? '是' : '否'),
    },
    {
      title: '分享数量',
      dataIndex: ['user_meta', 'share_num'],
    },
    {
      title: '积分',
      dataIndex: ['user_meta', 'points'],
      sorter: true,
      sortOrder: query.sort_order,
    },
    {
      title: '警告次数',
      dataIndex: 'warnings_nums',
    },
    {
      title: '操作',
      render: (record: any) => (
        <MoreActions record={record} reloadData={() => mutate()} />
      ),
    },
  ];

  return (
    <PageContainer ghost>
      <Card bodyStyle={{ padding: 0, marginBottom: 16 }} bordered={false}>
        <QueryFilter onFinish={handleSearch} onReset={handleReset}>
          <ProFormText name="email" label="邮箱" />
          <ProFormSelect
            label="管理员"
            name="is_admin"
            valueEnum={{
              '0': '否',
              '1': '是',
            }}
          />
        </QueryFilter>
      </Card>
      <Card bordered={false}>
        <Space
          size={[8, 8]}
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Typography.Title level={5} style={{ margin: 0 }}>
            用户列表
          </Typography.Title>
        </Space>

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
    </PageContainer>
  );
};

export default User;
