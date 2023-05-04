import useSWR from 'swr';
import { useModal } from '@/lib/hooks';
import { Form, message } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import api from '@/lib/utils/api';

interface Props {
  onFinish?: (values: any) => void;
  modalName?: string;
}

const UpdateChangeLogModalForm = ({
  onFinish,
  modalName = 'UpdateChangeLogModalForm',
}: Props) => {
  const [form] = Form.useForm();
  const { open, params, closeModal } = useModal<any>(modalName);

  const { data: response = {} } = useSWR<any>(
    params?.id && open ? `/api/v1/manager/change-logs/${params.id}` : null,
    api.get,
    {
      revalidateOnFocus: false,
      onSuccess: (response) => {
        const { data } = response;
        form.setFieldsValue(data);
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
      `/api/v1/manager/change-logs/${params?.id}`,
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
    <ModalForm<any>
      title="更新版本"
      preserve
      open={open}
      form={form}
      layout="vertical"
      onOpenChange={handleOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
    >
      <ProFormText
        name="version"
        label="版本"
        placeholder="请输入版本"
        rules={[{ required: true }]}
      />

      <ProFormTextArea
        fieldProps={{ autoSize: true }}
        name="content"
        label="内容"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default UpdateChangeLogModalForm;
