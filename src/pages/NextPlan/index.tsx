import api from '@/lib/utils/api';
import {
  PageContainer,
  ProForm,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';

const NextPlan = () => {
  const handleFinish = async (values: any) => {
    const { error } = await api.put<any, any>(
      '/api/v1/manager/next-plan',
      values,
    );
    if (error) {
      message.error(error.message);
      return;
    }

    message.success('更新成功');
  };

  return (
    <PageContainer ghost>
      <ProForm
        onFinish={handleFinish}
        request={async () => {
          try {
            const response = await api.get('/api/v1/manager/next-plan');
            return { ...response.data };
          } catch (error) {
            return {};
          }
        }}
      >
        <ProFormTextArea
          fieldProps={{ autoSize: true }}
          name="content"
          label="内容"
        />
      </ProForm>
    </PageContainer>
  );
};

export default NextPlan;
