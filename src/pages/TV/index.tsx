import useSWR from 'swr';
import api from '@/lib/utils/api';
import searchParamsToObj from '@/lib/utils/searchParamsToObj';
import SearchForm from './components/SearchForm';
import CreateTVModalForm from './components/CreateTVModalForm';
import FetchTVDetailModal from './components/FetchTVDetailModal';
import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams, useRouteProps } from '@umijs/max';
import { useModal } from '@/lib/hooks';
import { Card, Space, Table, Tag, Typography } from 'antd';
import type { Movie } from '@/services/types/movie';
import MoreActions from './components/MoreActions';
import ResourcesModal from './components/ResourcesModal';
import UpdateTVModalForm from './components/UpdateTVModalForm';
import SendMessageToTelegram from '@/components/SendMessageToTelegram';

interface Response<T> {
  data: T;
  meta: any;
}

const TvListPage = () => {
  const { meta: routeMeta } = useRouteProps(); // 获取当前路由信息
  const { openModal } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: response = {},
    isLoading,
    isValidating,
    mutate,
  } = useSWR<any>(`/api/v1/manager/tv?${searchParams.toString()}`, api.get);

  const { data: dataSource = [], meta = {} }: Response<Array<Movie>> = response;
  const title = `新增${routeMeta.recordName}`;

  const handleSearch = async (values: any) => {
    setSearchParams(values);
  };

  const handleTableChange = (
    pagination: any,
    _filters: any,
    _sorter: any,
    { action }: any,
  ) => {
    if (action === 'paginate') {
      const query = searchParamsToObj(searchParams);
      setSearchParams({
        ...query,
        page: pagination.current,
        per_page: pagination.pageSize,
      });

      return;
    }
  };

  const columns = [
    {
      title: '海报',
      dataIndex: 'poster_url',
      width: 80,
      render: (v: string) => {
        return <img src={v} width={64} />;
      },
    },
    {
      title: '标题',
      dataIndex: 'name',
      width: 198,
      render: (v: string) => {
        return (
          <Typography.Text style={{ width: 198 }} ellipsis={{ tooltip: v }}>
            {v}
          </Typography.Text>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'genres',
      width: 256,
      render: (v: any) => {
        return (
          v && (
            <Space wrap>
              {(v || []).map((i: any) => (
                <Tag key={i.id} style={{ margin: 0 }}>
                  {i.name}
                </Tag>
              ))}
            </Space>
          )
        );
      },
    },
    {
      title: '日期',
      dataIndex: 'first_air_date',
      render: (v: string, record: any) => {
        return (
          <Space>
            {v} 至 {record.last_air_date || '-'}
          </Space>
        );
      },
    },
    {
      title: 'Banner',
      dataIndex: 'is_banner',
      render: (v: boolean) => (v ? '是' : '否'),
    },
    {
      title: '操作',
      render: (record: any) => (
        <MoreActions record={record} reloadData={() => mutate()} />
      ),
    },
  ];

  const handleCreateMovieFinish = (response: any) => {
    const { data } = response;

    openModal('ResourcesModal', { slug: data.slug });
    mutate();
  };

  const pageActions = [<FetchTVDetailModal key="create" label={title} />];

  return (
    <PageContainer extra={pageActions}>
      <SearchForm params={searchParams} onSearch={handleSearch} />

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
          columns={columns}
          dataSource={dataSource}
          onChange={handleTableChange}
        />
      </Card>
      <CreateTVModalForm
        title={title}
        recordType={routeMeta.recordType}
        onFinish={handleCreateMovieFinish}
      />
      <UpdateTVModalForm onFinish={() => mutate()} />
      <ResourcesModal onFinish={() => mutate()} />
      <SendMessageToTelegram />
    </PageContainer>
  );
};

export default TvListPage;
