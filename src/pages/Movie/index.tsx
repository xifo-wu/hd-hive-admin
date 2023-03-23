import useSWR from 'swr';
import api from '@/lib/utils/api';
import searchParamsToObj from '@/lib/utils/searchParamsToObj';
import SearchForm from './components/SearchForm';
import CreateMovieModalForm from './components/CreateMovieModalForm';
import FetchMovieDetailModal from './components/FetchMovieDetailModal';
import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { useModal } from '@/lib/hooks';
import { Card, Space, Table, Tag, Typography } from 'antd';
import type { Movie } from '@/services/types/movie';
import MoreActions from './components/MoreActions';
import ResourcesModal from './components/ResourcesModal';
import UpdateMovieModalForm from './components/UpdateMovieModalForm';

interface Response<T> {
  data: T;
  meta: any;
}

const MovieListPage = () => {
  const { openModal } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: response = {},
    isLoading,
    isValidating,
    mutate,
  } = useSWR<any>(`/api/v1/manager/movies?${searchParams.toString()}`, api.get);

  const { data: dataSource = [], meta = {} }: Response<Array<Movie>> = response;

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
      dataIndex: 'title',
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
      title: '上映日期',
      dataIndex: 'release_date',
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

  const handleCreateMovieFinish = (values: any) => {
    openModal('ResourcesModal', { slug: values.slug });
    mutate();
  };

  return (
    <PageContainer extra={[<FetchMovieDetailModal key="createMovie" />]}>
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
      <CreateMovieModalForm onFinish={handleCreateMovieFinish} />
      <UpdateMovieModalForm onFinish={() => mutate()} />
      <ResourcesModal onFinish={() => mutate()} />
    </PageContainer>
  );
};

export default MovieListPage;
