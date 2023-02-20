import api from '@/lib/utils/api';
import {
  PageContainer,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';

const SystemSetting = () => {
  const handleFinish = async (values: any) => {
    const { error } = await api.put<any, any>('/api/v1/system-setting', values);
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
            const response = await api.get('/api/v1/system-setting');
            return { ...response.data };
          } catch (error) {
            return {};
          }
        }}
      >
        <ProFormText
          width="xl"
          name="telegram_bot_token"
          label="电报机器人 Token"
          required
        />
        <ProFormText
          width="xl"
          name="telegram_default_chat"
          label="电报机器人默认发送消息频道"
          required
        />
        <ProFormText
          width="xl"
          name="tmdb_app_key"
          label="TMDB API KEY"
          required
        />
      </ProForm>
    </PageContainer>
  );
};

export default SystemSetting;
