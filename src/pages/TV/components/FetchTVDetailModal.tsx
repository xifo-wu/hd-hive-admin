import { Button, Card, Col, message, Modal, Row } from 'antd';
import { ReactNode, useState } from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { getTmdbDetail } from '@/services/tmdb';
import useModal from '@/lib/hooks/useModal';
import tmdbAltShortIcon from '@/assets/tmdb_alt_short_icon.svg';
import api from '@/lib/utils/api';

interface Props {
  label?: string;
  trigger?: ReactNode;
  modalName?: string;
}

const FetchTVDetailModal = ({
  label,
  modalName = 'FetchTVDetailModal',
}: Props) => {
  const { open, closeModal, openModal } = useModal(modalName);
  const [selectedMode, setSelectedMode] = useState('');

  const handleSelectMode = (modeName: 'tmdb' | 'manual') => {
    setSelectedMode(modeName);
  };

  const handleIsExist = async (key: string, value: any) => {
    try {
      const response = await api.get<any, any>('/api/v1/manager/tv/is-exist', {
        params: {
          [key]: value,
        },
      });

      return response;
    } catch (error: any) {
      message.error(error.message);
      return;
    }
  };

  const handleTmdbFinish = async (values: any) => {
    const params = await getTmdbDetail(values.url);
    if (!params) {
      return;
    }

    const response = await handleIsExist('tmdb_id', params.id);
    if (!response) return;

    const {
      meta: { is_exist: isExist },
      data,
    } = response;

    if (typeof isExist !== 'boolean') return;

    if (isExist) {
      openModal('ResourcesModal', { slug: data.slug });
    } else {
      openModal('CreateTVModalForm', { ...params, tmdb_url: values.url });
    }

    closeModal(modalName);
  };

  return (
    <>
      <Button onClick={() => openModal(modalName)} type="primary">
        {label}
      </Button>
      <Modal
        title="数据获取来源"
        open={open}
        destroyOnClose
        onCancel={() => closeModal(modalName)}
        footer={false}
      >
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card
              hoverable
              onClick={() => handleSelectMode('tmdb')}
              style={{
                width: 240,
                ...(selectedMode === 'tmdb' && { borderColor: '#90cea1' }),
              }}
              bodyStyle={{ display: 'none' }}
              cover={
                <img
                  style={{ padding: 16 }}
                  alt="example"
                  src={tmdbAltShortIcon}
                />
              }
            />
          </Col>
        </Row>

        {selectedMode === 'tmdb' && (
          <div style={{ marginTop: 16 }}>
            <ProForm onFinish={handleTmdbFinish}>
              <ProFormText
                name="url"
                label="TMDB 链接"
                placeholder="请输入 TMDB 链接"
                required
              />
            </ProForm>
          </div>
        )}
      </Modal>
    </>
  );
};

export default FetchTVDetailModal;
