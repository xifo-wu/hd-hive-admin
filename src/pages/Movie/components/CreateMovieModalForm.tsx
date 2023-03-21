import { useModal } from '@/lib/hooks';
import { message } from 'antd';
import {
  ModalForm,
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { Movie } from '@/services/types/movie';
import { useState } from 'react';
import api from '@/lib/utils/api';

interface Props {
  onFinish?: () => void;
  modalName?: string;
}

const CreateMovieModalForm = ({
  onFinish,
  modalName = 'CreateMovieModalForm',
}: Props) => {
  const { open, params, closeModal } = useModal<Movie>(modalName);
  const [genres] = useState<string[]>(params?.genre_names || []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(modalName);
    }
  };

  const handleFinish = async (values: Movie) => {
    const payload = {
      ...values,
      tmdb_id: params?.id,
      imdb_id: params?.imdb_id,
      adult: params?.adult,
    };

    const { error } = await api.post<any, any>(
      '/api/v1/manager/movies',
      payload,
    );
    if (error) {
      message.error(error.message);
      return;
    }

    onFinish?.();
    return true;
  };

  return (
    <ModalForm<Movie>
      title="新建电影"
      preserve
      open={open}
      layout="vertical"
      onOpenChange={handleOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={params}
      rowProps={{
        gutter: [16, 16],
      }}
      grid
    >
      <ProForm.Group colProps={{ sm: 24, md: 12 }}>
        <ProFormText
          name="title"
          label="名称"
          placeholder="请输入名称"
          rules={[{ required: true }]}
        />

        <ProFormText
          name="original_title"
          label="原名"
          placeholder="请输入原名"
          rules={[{ required: true }]}
        />

        <ProFormText
          name="release_date"
          label="上映日期"
          placeholder="请输入上映日期"
        />
      </ProForm.Group>

      <ProForm.Group colProps={{ sm: 12, md: 6 }}>
        <ProFormDependency name={['poster_path']}>
          {({ poster_path }) => {
            return (
              <img
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 16,
                }}
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              />
            );
          }}
        </ProFormDependency>
      </ProForm.Group>

      <ProForm.Group colProps={{ sm: 12, md: 6 }}>
        <ProFormDependency name={['backdrop_path']}>
          {({ backdrop_path }) => {
            return (
              <img
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 16,
                }}
                src={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
              />
            );
          }}
        </ProFormDependency>

        <ProFormDependency name={['logo_path']}>
          {({ logo_path }) => {
            return (
              <img
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 16,
                }}
                src={`https://image.tmdb.org/t/p/w500${logo_path}`}
              />
            );
          }}
        </ProFormDependency>
      </ProForm.Group>

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="poster_path"
        label="海报"
        placeholder="请输入海报"
        rules={[{ required: true }]}
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="backdrop_path"
        label="背景"
        placeholder="请输入背景"
        rules={[{ required: true }]}
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="logo_path"
        label="Logo"
        placeholder="请输入 Logo"
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="original_language"
        label="原始语言"
        placeholder="请输入原始语言"
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="runtime"
        label="时长"
        placeholder="请输入时长"
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="tagline"
        label="标语"
        placeholder="请输入标语"
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="status"
        label="状态"
        placeholder="请输入状态"
      />

      <ProFormSelect
        colProps={{ sm: 24, md: 16 }}
        options={genres}
        fieldProps={{
          mode: 'tags',
        }}
        name="genre_names"
        label="分类"
      />

      <ProFormTextArea
        colProps={{ span: 24 }}
        name="overview"
        label="电影简介"
      />
    </ModalForm>
  );
};

export default CreateMovieModalForm;
