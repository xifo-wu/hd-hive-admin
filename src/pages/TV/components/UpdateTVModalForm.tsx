import useSWR from 'swr';
import { useModal } from '@/lib/hooks';
import { Form, message } from 'antd';
import { ModalForm } from '@ant-design/pro-components';
import { useState } from 'react';
import api from '@/lib/utils/api';
import TVCommonForm from './TVCommonForm';

interface Props {
  onFinish?: (values: any) => void;
  modalName?: string;
}

const UpdateTVModalForm = ({
  onFinish,
  modalName = 'UpdateTVModalForm',
}: Props) => {
  const [form] = Form.useForm();
  const { open, params, closeModal } = useModal<any>(modalName);
  const [genres, setGenres] = useState<string[]>([]);

  const { data: response = {} } = useSWR<any>(
    params?.slug && open ? `/api/v1/manager/tv/${params.slug}` : null,
    api.get,
    {
      revalidateOnFocus: false,
      onSuccess: (response) => {
        const { data } = response;
        const genres = (data.genres || []).map((i: any) => i.name);
        setGenres(genres);
        form.setFieldsValue({
          ...data,
          genre_names: genres,
        });
      },
    },
  );

  const { data } = response;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(modalName);
    }
  };

  const handleFinish = async (values: any) => {
    const payload = {
      ...data,
      ...values,
    };

    const { response, error } = await api.put<any, any>(
      `/api/v1/manager/tv/${params?.slug}`,
      payload,
    );

    if (error) {
      message.error(error.message);
      return;
    }

    onFinish?.(response);
    return true;
  };

  return (
    <ModalForm
      title="新建电影"
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
      <TVCommonForm genres={genres} />
    </ModalForm>
  );
};

export default UpdateTVModalForm;
