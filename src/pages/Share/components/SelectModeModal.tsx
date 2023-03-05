import _ from 'lodash';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, message, Modal, Row } from 'antd';
import { useState } from 'react';
import { useModal } from '@/lib/hooks';
import styles from '../styles.less';
import api from '@/lib/utils/api';

const tmdbUrlRegex = /\/(movie|tv)\/(\d+)/;

const modalName = 'SelectModeModal';
const SelectModeModal = () => {
  const { open, closeModal, openModal } = useModal(modalName);
  const [selectedMode, setSelectedMode] = useState('');

  const handleInputTmdbUrl = (mode: 'tmdb' | 'manual') => {
    setSelectedMode(mode);
    if (mode === 'manual') {
      // TODO 直接打开表单
      openModal('CreateShareModalForm');
    }
  };

  const handleTmdbFinish = async (values: any) => {
    const match = values.url.match(tmdbUrlRegex);
    if (!match) {
      // 匹配失败
      message.error('TMDb URL 解析失败');
      return;
    }

    // 匹配成功
    const type = match[1]; // 获取电影或电视节目的类型
    const id = match[2]; // 获取电影或电视节目的ID

    try {
      const data = await api.get<any, any>(`/api/v1/tmdb/${type}/${id}`);

      const genres = (data.genres || []).map((item: any) => item.name);

      const poster_path = _.chain(data)
        .get('images.posters') // @ts-ignore
        .find((i: any) => i.iso_639_1 === 'en')
        .get('file_path')
        .value();

      let params: any = {
        genres,
        backdrop_path: data.backdrop_path,
        overview: (data.overview || '').replaceAll('\r', ''),
        poster_path: poster_path || data.poster_path,
        // 因英文海报更简洁，故优先取英文海报
        // poster_path: _.find(_.get(data, "images.posters"))
        tagline: data.tagline,
        tmdb_type: type,
        tmdb_id: id,
      };

      if (type === 'tv') {
        const keywords = [`#${data.name}`].concat(
          (data.genres || []).map((item: any) => `#${item.name}`),
        );

        params = {
          ...params,
          title: data.name,
          keywords,
          original_title: data.original_name,
          number_of_episodes: data.number_of_episodes,
          number_of_seasons: data.number_of_seasons,
          release_date: data.first_air_date,
          runtime: data?.episode_run_time?.[0],
        };
      } else if (type === 'movie') {
        const keywords = [`#${data.title}`].concat(
          (data.genres || []).map((item: any) => `#${item.name}`),
        );

        params = {
          ...params,
          keywords,
          title: data.title,
          original_title: data.original_title,
          runtime: data.runtime,
          release_date: data.release_date,
        };
      }

      message.success('获取资料成功 🎉');
      openModal('CreateShareModalForm', params);
    } catch (error: any) {
      message.warning(error.message);
      return;
    }
  };

  const handleCancel = () => {
    closeModal(modalName);
    setSelectedMode('');
  };

  return (
    <>
      <Button type="primary" onClick={() => openModal(modalName)}>
        <PlusOutlined />
        添加分享
      </Button>

      <Modal
        onCancel={handleCancel}
        open={open}
        title="元数据来源"
        footer={false}
      >
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <div
              onClick={() => handleInputTmdbUrl('tmdb')}
              className={styles.tmdbCard}
            >
              TMDB
            </div>
          </Col>

          <Col span={12}>
            <div
              onClick={() => handleInputTmdbUrl('manual')}
              className={styles.manualCard}
            >
              手动填写
            </div>
          </Col>
        </Row>

        {selectedMode === 'tmdb' && (
          <div style={{ marginTop: 16 }}>
            <ProForm onFinish={handleTmdbFinish}>
              <ProFormText
                name="url"
                label="tmdb 链接"
                placeholder="请输入 tmdb 链接"
                required
              />
            </ProForm>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SelectModeModal;
