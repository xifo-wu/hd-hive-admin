import { history } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import api from '@/lib/utils/api';
import styles from './index.less';
import { Space } from 'antd';

const background =
  'https://images.unsplash.com/photo-1527181152855-fc03fc7949c8';

const Login = () => {
  const handleFinish = async (values: any) => {
    const { response, error } = await api.post<any, any>(
      '/api/v1/login',
      values,
    );
    if (error) {
      message.error(error.message);
      return;
    }

    const { meta } = response;
    localStorage.setItem('accessToken', meta.access_token);
    history.push('/admin');
  };
  return (
    <div className={styles.container}>
      <div className="content">
        <div className="content-box">
          <Space className="header" align="center">
            <img style={{ width: 48 }} src="/logo.png" />
            <span className="brand">HD Hive</span>
          </Space>

          <div className="login-box">
            <h2 className="title">欢迎回来</h2>
            <p className="sub-title">开始分享你的资源吧</p>

            <Form
              name="basic"
              layout="vertical"
              onFinish={handleFinish}
              autoComplete="off"
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入您的用户名！' }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入您的密码!' }]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item label=" ">
                <Button type="primary" htmlType="submit" size="large" block>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <div
        className="cover"
        style={{ backgroundImage: `url(${background})` }}
      />
    </div>
  );
};

export default Login;
