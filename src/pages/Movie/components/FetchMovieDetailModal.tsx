import { Button, Card, Col, message, Modal, Row } from 'antd';
import { ReactNode, useState } from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import useModal from '@/lib/hooks/useModal';
import { getTmdbDetail } from '@/services/tmdb';
import type { Movie } from '@/services/types/movie';
import api from '@/lib/utils/api';

interface Props {
  trigger?: ReactNode;
  modalName?: string;
}

const FetchMovieDetailModal = ({
  modalName = 'FetchMovieDetailModal',
}: Props) => {
  const { open, closeModal, openModal } = useModal(modalName);
  const [selectedMode, setSelectedMode] = useState('');

  const handleSelectMode = (modeName: 'tmdb' | 'tmdbSearch' | 'manual') => {
    setSelectedMode(modeName);
  };

  const handleTmdbSearchFinish = async (values: any) => {
    closeModal(modalName);
    openModal('TmdbMovieSearchModalForm', values);
  };

  const handleIsExist = async (key: string, value: any) => {
    try {
      const response = await api.get<any, any>(
        '/api/v1/manager/movies/is-exist',
        {
          params: {
            [key]: value,
          },
        },
      );

      return response;
    } catch (error: any) {
      message.error(error.message);
      return;
    }
  };

  const handleTmdbFinish = async (values: any) => {
    const params: Movie = await getTmdbDetail(values.url);
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
      openModal('CreateMovieModalForm', { ...params, tmdb_url: values.url });
    }

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
              size="small"
              hoverable
              onClick={() => handleSelectMode('tmdbSearch')}
            >
              <div
                style={{
                  textAlign: 'center',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage:
                    'linear-gradient(to right, #90cea1 10%, #01b4e4)',
                  fontWeight: 800,
                  fontSize: '1.625rem',
                }}
              >
                TMDB 搜索
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card
              size="small"
              hoverable
              onClick={() => handleSelectMode('tmdb')}
            >
              <div
                style={{
                  textAlign: 'center',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage:
                    'linear-gradient(to right, #90cea1 10%, #01b4e4)',
                  fontWeight: 800,
                  fontSize: '1.625rem',
                }}
              >
                TMDB 链接
              </div>
            </Card>
          </Col>
        </Row>

        {selectedMode === 'tmdbSearch' && (
          <div style={{ marginTop: 16 }}>
            <ProForm onFinish={handleTmdbSearchFinish}>
              <ProFormText
                name="query"
                label="关键字"
                placeholder="请输入影片关键字"
                rules={[
                  {
                    required: true,
                    message: '请输入关键字',
                  },
                ]}
              />

              <ProFormText
                name="primary_release_year"
                label="年份"
                placeholder="请输入影片年份"
              />
            </ProForm>
          </div>
        )}

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
