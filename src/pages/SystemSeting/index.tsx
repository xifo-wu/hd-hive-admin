import api from '@/lib/utils/api';
import {
  PageContainer,
  ProForm,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Alert, message } from 'antd';

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
      <Alert
        style={{ margin: '0 0 32px 0' }}
        message={
          <span>
            图片可以通过图床上传 (
            <a
              href="https://telegraph-image.pages.dev"
              target="_blank"
              rel="noreferrer"
            >
              https://telegraph-image.pages.dev
            </a>
            )
          </span>
        }
        type="info"
        showIcon
      />
      <ProForm
        onFinish={handleFinish}
        grid
        rowProps={{
          gutter: [16, 16],
        }}
        request={async () => {
          try {
            const response = await api.get('/api/v1/system-setting');
            return { ...response.data };
          } catch (error) {
            return {};
          }
        }}
      >
        <ProForm.Group
          colProps={{
            md: 12,
            xs: 24,
            sm: 24,
            xl: 8,
          }}
          title="消息通知"
        >
          <ProFormText
            name="telegram_bot_token"
            label="电报机器人 Token"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="telegram_default_chat"
            label="电报机器人默认发送消息频道"
            required
          />
        </ProForm.Group>

        <ProForm.Group
          title="影视资料"
          colProps={{
            md: 12,
            xs: 24,
            sm: 24,
            xl: 8,
          }}
        >
          <ProFormText name="tmdb_app_key" label="TMDB API KEY" required />
        </ProForm.Group>

        <ProForm.Group
          colProps={{
            md: 12,
            xs: 24,
            sm: 24,
            xl: 8,
          }}
          title="注册配置"
        >
          <ProFormText
            name="invitation_code"
            label="注册邀请码"
            rules={[{ required: true }]}
          />
          <ProFormSwitch name="is_allow_register" label="是否允许注册" />
        </ProForm.Group>
        <ProForm.Group
          title="页面配置"
          colProps={{
            md: 12,
            xs: 24,
            sm: 24,
            xl: 8,
          }}
        >
          <ProFormText name="shop_qr_code" label="商城购买VIP二维码地址" />
          <ProFormText name="backdrop_url" label="背景图片(登录页、注册页)" />
        </ProForm.Group>

        <ProFormTextArea
          colProps={{ span: 24 }}
          name="telegram_notification_ad"
          label="TG 通知广告"
        />

        <ProFormTextArea
          colProps={{ span: 24 }}
          name="telegram_inline_keyboard"
          label="TG Bot 通用广告"
        />

        <ProFormTextArea
          colProps={{ span: 24 }}
          name="telegram_checkin_ads_keyboard"
          label="TG Bot 签到广告"
        />
      </ProForm>
    </PageContainer>
  );
};

export default SystemSetting;
