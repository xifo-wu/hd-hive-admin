import { useModal } from '@/lib/hooks';
import { message } from 'antd';
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

const CreatChangeLogModalForm = ({
  onFinish,
  modalName = 'CreatChangeLogModalForm',
}: Props) => {
  const { open, closeModal } = useModal<any>(modalName);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(modalName);
    }
  };

  const handleFinish = async (values: any) => {
    const { response, error } = await api.post<any, any>(
      '/api/v1/manager/change-logs',
      values,
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
      title="新建版本"
      preserve
      open={open}
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

export default CreatChangeLogModalForm;
