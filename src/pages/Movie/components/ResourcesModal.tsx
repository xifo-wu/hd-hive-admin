import _ from 'lodash';
import { useModal } from '@/lib/hooks';
import { Avatar, Button, Modal, Space, Table, Tag, Typography } from 'antd';
import { useModel } from '@umijs/max';
import useSWR from 'swr';
import api from '@/lib/utils/api';
import CreatResourceModalForm from '@/components/CreatResourceModalForm';
import dayjs from 'dayjs';

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

  const { data: { resources = [] } = {} } = response;

  const myResources = _.filter(resources, (i) => i.user_id === currentUser?.id);
  const otherResources = _.filter(
    resources,
    (i) => i.user_id !== currentUser?.id,
  );

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

  const columns = [...commonColumns];

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
    openModal('CreatResourceModalForm', { slug: params!.slug });
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

      <CreatResourceModalForm onFinish={() => mutate()} />
    </Modal>
  );
};

export default ResourcesModal;
