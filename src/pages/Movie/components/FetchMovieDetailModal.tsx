import { Button, Card, Col, Modal, Row } from 'antd';
import { ReactNode, useState } from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import useModal from '@/lib/hooks/useModal';
import tmdbAltShortIcon from '@/assets/tmdb_alt_short_icon.svg';
import { getTmdbDetail } from '@/services/tmdb';
import type { Movie } from '@/services/types/movie';

interface Props {
  trigger?: ReactNode;
  modalName?: string;
}

const FetchMovieDetailModal = ({
  modalName = 'FetchMovieDetailModal',
}: Props) => {
  const { open, closeModal, openModal } = useModal(modalName);
  const [selectedMode, setSelectedMode] = useState('');

  const handleSelectMode = (modeName: 'tmdb' | 'manual') => {
    setSelectedMode(modeName);
  };

  const handleTmdbFinish = async (values: any) => {
    const params: Movie = await getTmdbDetail(values.url);
    if (!params) {
      return;
    }

    openModal('CreateMovieModalForm', params);
    closeModal(modalName);
  };

  return (
    <>
      <Button onClick={() => openModal(modalName)} type="primary">
        新增电影
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

export default FetchMovieDetailModal;
