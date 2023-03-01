import dayjs from 'dayjs';
import useSWR from 'swr';
import { useSearchParams } from '@umijs/max';
import {
  ProFormText,
  QueryFilter,
  PageContainer,
} from '@ant-design/pro-components';
import { Button, Card, message, Space, Table, Tag, Typography } from 'antd';
import api from '@/lib/utils/api';
import EditModalForm from './components/EditModalForm';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import SendMessageToTelegram from './components/SendMessageToTelegram';
import SelectModeModal from './components/SelectModeModal';
import CreateShareModalForm from './components/CreateShareModalForm';
import { useModal } from '@/lib/hooks';
import MoreActions from './components/MoreActions';

const { Text } = Typography;

const categories: Record<string, string> = {
  movie: '电影',
  tb: '剧集',
  anime: '动漫',
  zongyi: '综艺',
  study: '学习',
  documentary: '纪录片',
  ebook: '电子书',
  recital: '演唱会',
};

const searchParamsToObject = (searchParams: URLSearchParams) => {
  const object: Record<string, string> = {};
  for (const [key, value] of searchParams) {
    object[key] = value;
  }

  return object;
};

const Share = () => {
  const { openModal } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: res = {},
    isLoading,
    mutate,
  } = useSWR<any>(`/api/v1/share?${searchParams.toString()}`, api.get);

  const { data: dataSource = [], meta = {} } = res;

  const handleSearch = async (values: any) => {
    setSearchParams(values);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handlePrev = () => {
    const obj = searchParamsToObject(searchParams);
    setSearchParams({
      ...obj,
      before: meta.before,
      after: '',
    });
  };

  const handleNext = () => {
    const obj = searchParamsToObject(searchParams);
    setSearchParams({
      ...obj,
      before: '',
      after: meta.after,
    });
  };

  const handleDelete = async (slug: string) => {
    const { error } = await api.delete<any, any>(`/api/v1/share/${slug}`);

    if (error) {
      message.error(error.message);
      return;
    }

    message.success('删除成功');
    if (meta.after === meta.before) {
      const obj = searchParamsToObject(searchParams);
      setSearchParams({
        ...obj,
        before: meta.before,
        after: '',
      });
      return;
    }
    mutate();
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
      width: 128,
      render: (v: string) => {
        return (
          <Text style={{ width: 128 }} ellipsis={{ tooltip: v }}>
            {v}
          </Text>
        );
      },
    },
    {
      title: '分类',
      dataIndex: 'share_type',
      render: (v: string) => categories[v] || '未知',
    },
    // {
    //   title: '简介',
    //   dataIndex: 'overview',
    //   width: 256,
    //   render: (v: string) => {
    //     return (
    //       <Typography.Paragraph
    //         ellipsis={{ rows: 4, expandable: true, symbol: '更多' }}
    //       >
    //         {v}
    //       </Typography.Paragraph>
    //     );
    //   },
    // },
    {
      title: '类型',
      dataIndex: 'genres',
      width: 256,
      render: (v: any) => {
        return (
          v && (
            <Space wrap>
              {(v || []).map((i: any) => (
                <Tag key={i} style={{ margin: 0 }}>
                  {i}
                </Tag>
              ))}
            </Space>
          )
        );
      },
    },
    {
      title: '最后更新时间',
      dataIndex: 'updated_at',
      render: (v: any) => dayjs(v).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      // fixed: 'right',
      render: (record: any) => {
        return (
          <Space>
            <Button
              size="small"
              onClick={() =>
                openModal('SendMessageToTelegram', { slug: record.slug })
              }
              type="link"
            >
              Telegram 通知
            </Button>
            <EditModalForm slug={record.slug} onFinish={() => mutate()} />
            <MoreActions
              record={record}
              onDelete={handleDelete}
              reloadData={() => mutate()}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer ghost>
      <Card bodyStyle={{ padding: 0, marginBottom: 16 }} bordered={false}>
        <QueryFilter onFinish={handleSearch} onReset={handleReset}>
          <ProFormText name="title" label="资源名称" />
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
            资源列表
          </Typography.Title>
          <Space size={[8, 8]}>
            <SelectModeModal />
          </Space>
        </Space>

        <Table
          pagination={false}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          // @ts-ignore 加个 fixed right 就报错。无语 😓
          columns={columns}
          dataSource={dataSource}
        />

        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Space size="middle">
            <Button
              size="large"
              type="text"
              icon={<LeftOutlined />}
              disabled={!meta.has_prev}
              onClick={handlePrev}
            />
            <Button
              size="large"
              type="text"
              icon={<RightOutlined />}
              disabled={!meta.has_next}
              onClick={handleNext}
            />
          </Space>
        </div>
      </Card>

      <CreateShareModalForm onFinish={() => mutate()} />
      <SendMessageToTelegram />
    </PageContainer>
  );
};

export default Share;
