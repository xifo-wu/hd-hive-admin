import _ from 'lodash';
import { useModal } from '@/lib/hooks';
import {
  Avatar,
  Button,
  Divider,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useModel } from '@umijs/max';
import useSWR from 'swr';
import api from '@/lib/utils/api';
import CreateResourceModalForm from '@/components/CreateResourceModalForm';
import dayjs from 'dayjs';
import EditResourceModalForm from '@/components/EditResourceModalForm';

interface Props {
  modalName?: string;
  onFinish?: (values: any) => void;
}

interface Params {
  slug: string;
}

const ResourcesModal = ({ modalName = 'ResourcesModal' }: Props) => {
  const { params, open, openModal, closeModal } = useModal<Params>(modalName);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;

  const {
    data: response = {},
    isLoading,
    isValidating,
    mutate,
  } = useSWR<any, any>(
    open && params?.slug ? `/api/v1/manager/movies/${params.slug}` : null,
    api.get,
  );

  const { data = {} } = response;
  const { resources = [] } = data;

  const myResources = _.filter(resources, (i) => i.user_id === currentUser?.id);
  const otherResources = _.filter(
    resources,
    (i) => i.user_id !== currentUser?.id,
  );

  const handleDestroy = async (id: number) => {
    const { error } = await api.delete<any, any>(
      `/api/v1/manager/resources/${id}`,
    );

    if (error) {
      message.error(error.message);
      return;
    }

    message.success('删除成功');
    mutate();
  };

  const handleEdit = (id: number) => {
    openModal('EditResourceModalForm', { id });
  };

  const commonColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (v: string, record: any) => {
        return (
          <Typography.Paragraph
            copyable={{ text: record.url, tooltips: '复制分享链接' }}
          >
            <a href={record.url} target="_blank" rel="noreferrer">
              {v}
            </a>
          </Typography.Paragraph>
        );
      },
    },
    {
      title: '大小',
      dataIndex: 'share_size',
    },
    {
      title: '分辨率',
      dataIndex: 'video_resolution',
      render: (v: any) => {
        return (
          v && (
            <Space wrap>
              {(v || []).map((i: any) => (
                <Tag color="cyan" key={i} style={{ margin: 0 }}>
                  {i}
                </Tag>
              ))}
            </Space>
          )
        );
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
      render: (v: any) => {
        return (
          v && (
            <Space wrap>
              {(v || []).map((i: any) => (
                <Tag key={i} color="green" style={{ margin: 0 }}>
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
      render: (v: string) => dayjs(v).fromNow(),
    },
  ];

  const handleSendMessage = (record: any) => {
    const releaseYear = data.release_date
      ? `(${dayjs(data.release_date).format('YYYY')})`
      : '';

    const source = _.map(record.source, (i) => `[${i}]`).join('');
    const videoResolution = _.map(
      record.video_resolution,
      (i) => `[${i}]`,
    ).join('');

    const subtitle = [
      ..._.map(record.subtitle_language, (i) => `#${i}`),
      ..._.map(record.subtitle_type, (i) => `#${i}`),
    ].join('/');

    const keywords = _.map(data.genres, (i) => `#${i.name}`).join('/');

    const params: Record<string, any> = {
      title: `${data.title}${releaseYear}${source}${videoResolution}  `,
      overview: `简介：${data.overview}  `,
      poster_url: data.poster_url,
      share_url: record.url,
      share_size: record.share_size ? `大小：${record.share_size}  ` : '',
      subtitle: subtitle ? `字幕：${subtitle}  ` : '',
      keywords: keywords ? `标签：#${data.title}/${keywords}  ` : '',
      web_link: `<a href="https://hdhive.org/movies/${data.slug}">${data.title} - 影巢</a>  `,
    };

    openModal('SendMessageToTelegram', params);
  };

  const columns = [
    ...commonColumns,
    {
      title: '操作',
      render: (record: any) => {
        return (
          <Space split={<Divider type="vertical" />}>
            <a
              onClick={() => handleSendMessage(record)}
              style={{ color: '#10b981' }}
            >
              通知
            </a>
            <a onClick={() => handleEdit(record.id)}>编辑</a>
            <Popconfirm
              title="你确定要删除吗?"
              description="删除后将无法恢复哦"
              onConfirm={() => handleDestroy(record.id)}
            >
              <a style={{ color: '#ef4444' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const otherColumns = [
    ...commonColumns,
    {
      title: '分享人',
      dataIndex: ['user', 'nickname'],
      render: (v: string, record: any) => {
        const { user } = record;

        return (
          <Space>
            <Avatar
              src={user.avatar || user.gravatar_url}
              size="small"
              shape="square"
            />
            <Typography.Link
              ellipsis
              style={{ width: 120 }}
              href={`https://www.hdhive.org/user/${user.id}`}
              target="_blank"
            >
              {v}
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  const handleCreateResource = () => {
    openModal('CreateResourceModalForm', {
      slug: params!.slug,
      title: data.title,
      release_date: data.release_date,
    });
  };

  return (
    <Modal
      title="分享列表"
      width={1200}
      open={open}
      onCancel={() => closeModal(modalName)}
    >
      <Typography.Title
        level={5}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>我的分享</span>
        <Button type="primary" onClick={handleCreateResource}>
          新建分享
        </Button>
      </Typography.Title>
      <Table
        loading={isLoading || isValidating}
        rowKey="id"
        columns={columns}
        dataSource={myResources}
        scroll={{ x: 'max-content' }}
      />

      <Typography.Title level={5}>他人分享</Typography.Title>
      <Table
        loading={isLoading || isValidating}
        rowKey="id"
        columns={otherColumns}
        dataSource={otherResources}
        scroll={{ x: 'max-content' }}
      />

      <CreateResourceModalForm onFinish={() => mutate()} />
      <EditResourceModalForm onFinish={() => mutate()} />
    </Modal>
  );
};

export default ResourcesModal;
