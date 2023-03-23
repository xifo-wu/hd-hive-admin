import useSWR from 'swr';
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

const EditResourceModalForm = ({
  onFinish,
  modalName = 'EditResourceModalForm',
}: Props) => {
  const [form] = Form.useForm();
  const { open, params, closeModal } = useModal<any>(modalName);

  useSWR<any>(
    params.id && open ? `/api/v1/manager/resources/${params.id}` : null,
    api.get,
    {
      revalidateOnFocus: false,
      onSuccess: (response) => {
        const { data } = response;
        form.setFieldsValue({
          ...data,
          video_resolution: data.video_resolution || [],
          source: data.source || [],
          subtitle_language: data.subtitle_language || [],
          subtitle_type: data.subtitle_type || [],
        });
      },
    },
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(modalName);
    }
  };

  const handleFinish = async (values: any) => {
    const { error } = await api.put<any, any>(
      `/api/v1/manager/resources/${params.id}`,
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
      title="更新分享"
      preserve
      open={open}
      form={form}
      layout="vertical"
      onOpenChange={handleOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
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
        }}
        name="source"
        label="来源"
      />

      <ProFormSelect
        colProps={{ sm: 24, md: 12 }}
        options={[
          { label: '简中', value: '简中' },
          { label: '繁中', value: '繁中' },
          { label: '简英', value: '简英' },
          { label: '简日', value: '简日' },
        ]}
        fieldProps={{
          mode: 'tags',
        }}
        name="subtitle_language"
        label="字幕语言"
      />

      <ProFormSelect
        colProps={{ sm: 24, md: 12 }}
        options={[
          { label: '外挂', value: '外挂' },
          { label: '内封', value: '内封' },
          { label: '内嵌', value: '内嵌' },
        ]}
        fieldProps={{
          mode: 'tags',
        }}
        name="subtitle_type"
        label="字幕种类"
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

export default EditResourceModalForm;
