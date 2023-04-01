import { stringify } from 'qs';
import useSWR from 'swr';
import { useModal } from '@/lib/hooks';
import { message, Modal, Typography } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import api from '@/lib/utils/api';
import { useState } from 'react';

interface Props {
  modalName?: string;
  onFinish?: () => void;
}

const ReplaceBannerModal = ({
  modalName = 'ReplaceBannerModal',
  onFinish,
}: Props) => {
  const { open, closeModal, params } = useModal<any>(modalName);
  const { slug, modelName, query } = params;
  const [target, setTarget] = useState('');

  const { data: response = {}, error } = useSWR<any>(
    open && modelName
      ? `/api/v1/manager/${modelName}?${stringify(query)}`
      : null,
    api.get,
    {
      dedupingInterval: 500,
    },
  );

  const handleCancel = () => {
    closeModal(modalName);
  };

  const handleOk = async () => {
    if (!target) {
      message.error('必须选择一个要替换的资源');
      return;
    }

    const { response, error } = await api.put<any, any>(
      `/api/v1/manager/${modelName}/${slug}/replace-banner`,
      {
        target,
      },
    );

    if (error) {
      message.error(error.message);
      return;
    }

    message.success(response.message || '替换成功');
    closeModal(modalName);
    onFinish?.();
  };

  const { data = [] } = response;

  return (
    <Modal
      title="选择一个要替换的分享"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      width={1200}
    >
      {error && error.message}
      <CheckCard.Group
        onChange={(value) => {
          setTarget(value as string);
        }}
      >
        {data.map((item: any) => {
          return (
            <CheckCard
              key={item.slug}
              avatar={<img src={item.poster_url} width={64} />}
              title={
                <Typography.Text style={{ width: 256 }} ellipsis>
                  {item.title || item.name}
                </Typography.Text>
              }
              description={
                <Typography.Text
                  type="secondary"
                  style={{ width: 256 }}
                  ellipsis
                >
                  {item.original_title || item.original_name}
                </Typography.Text>
              }
              value={item.slug}
            />
          );
        })}
      </CheckCard.Group>
    </Modal>
  );
};

export default ReplaceBannerModal;
