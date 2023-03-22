import _ from 'lodash';
import { useModal } from '@/lib/hooks';
import { Form, message } from 'antd';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import api from '@/lib/utils/api';
import type { Movie } from '@/services/types/movie';

interface Props {
  onFinish?: () => void;
  modalName?: string;
}

const CreatResourceModalForm = ({
  onFinish,
  modalName = 'CreatResourceModalForm',
}: Props) => {
  const [form] = Form.useForm();
  const { open, params, closeModal } = useModal<any>(modalName);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(modalName);
    }
  };

  const handleGenAutoTitle = () => {
    const videoResolution = _.map(
      form.getFieldValue('video_resolution'),
      (i: string) => `[${i}]`,
    ).join('');
    const source = _.map(
      form.getFieldValue('source'),
      (i: string) => `[${i}]`,
    ).join('');
    const share_size = form.getFieldValue('share_size');

    form.setFieldValue(
      'title',
      `${source}${videoResolution}${share_size ? `[${share_size}]` : ''}`,
    );
  };

  const handleFinish = async (values: any) => {
    const { error } = await api.post<any, any>(
      `/api/v1/manager/movies/${params.slug}/add-resource`,
      values,
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
      title="新建分享"
      preserve
      open={open}
      form={form}
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
      <ProFormText
        colProps={{ span: 18 }}
        name="url"
        label="分享链接"
        placeholder="请输入分享链接"
        rules={[{ required: true }]}
      />

      <ProFormText
        colProps={{ sm: 24, md: 6 }}
        name="share_size"
        label="大小"
        fieldProps={{
          onChange: handleGenAutoTitle,
        }}
        placeholder="请输入大小"
      />

      <ProFormSelect
        colProps={{ sm: 24, md: 12 }}
        options={[
          { label: '720P', value: '720P' },
          { label: '1080P', value: '1080P' },
          { label: '2K', value: '2K' },
          { label: '4k', value: '4k' },
        ]}
        fieldProps={{
          mode: 'tags',
          onChange: handleGenAutoTitle,
        }}
        name="video_resolution"
        label="分辨率"
      />

      <ProFormSelect
        colProps={{ sm: 24, md: 12 }}
        options={[
          { label: 'BluRay', value: 'BluRay' },
          { label: 'WEB-DL', value: 'WEB-DL' },
          { label: 'HDTV', value: 'HDTV' },
        ]}
        fieldProps={{
          mode: 'tags',
          onChange: handleGenAutoTitle,
        }}
        name="source"
        label="来源"
      />

      <ProFormText
        colProps={{ sm: 24, md: 24 }}
        name="title"
        label="标题"
        placeholder="请输入标题"
        rules={[{ required: true }]}
      />

      <ProFormTextArea colProps={{ span: 24 }} name="remark" label="备注" />
    </ModalForm>
  );
};

export default CreatResourceModalForm;
