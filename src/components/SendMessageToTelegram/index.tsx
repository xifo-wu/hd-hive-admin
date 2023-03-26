import useSWR from 'swr';
import api from '@/lib/utils/api';
import {
  ModalForm,
  ModalFormProps,
  ProFormTextArea,
} from '@ant-design/pro-components';
import ReactMarkdown from 'react-markdown';
import { Row, Col, Form, Card, notification } from 'antd';
import styles from './styles.less';
import rehypeRaw from 'rehype-raw';
import { useModal } from '@/lib/hooks';
import { useEffect } from 'react';

type Props = {
  modalName?: string;
} & ModalFormProps;

const SendMessageToTelegram = ({
  modalName = 'SendMessageToTelegram',
}: Props) => {
  const { open, params = {}, closeModal } = useModal<any>(modalName);
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();

  const { data: response = {} } = useSWR<any>(
    open ? '/api/v1/system-setting' : null,
    api.get,
  );

  const { data: setting } = response;

  useEffect(() => {
    if (open && setting?.id) {
      form.setFieldValue(
        'caption',
        `名称：<b>${params.title}</b>  

${params.overview}

${params.keywords}
${params.subtitle}
${params.share_size}

${params.share_url}
${params.web_link}
${setting?.telegram_notification_ad || ''}
        `,
      );
    }
  }, [open, setting?.id]);

  const handleSubmit = async (values: any) => {
    const { error } = await api.post<any, any>(
      `/api/v1/manager/telegram/send-resource`,
      {
        ...values,
        poster_url: params.poster_url,
      },
    );

    if (error) {
      notificationApi.error({
        message: error.message,
        description: error?.data?.description,
      });

      return false;
    }

    return true;
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(modalName);
    }
  };

  return (
    <ModalForm
      open={open}
      form={form}
      preserve={false}
      title="发送消息到 Telegram"
      onFinish={handleSubmit}
      onOpenChange={handleOpenChange}
    >
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col md={10} sm={24}>
          <Card
            bordered={false}
            style={{ boxShadow: 'none' }}
            bodyStyle={{ padding: '4px 0' }}
            cover={<img alt="电影海报" src={params?.poster_url} />}
          >
            <Form.Item shouldUpdate style={{ fontSize: 12 }}>
              {() => {
                return (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    className={styles.markdown}
                  >
                    {form.getFieldValue('caption')}
                  </ReactMarkdown>
                );
              }}
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} md={14} sm={24}>
          <span>
            需要用 Telegram 的
            <a
              href="https://core.telegram.org/bots/api#html-style"
              target="_blank"
              rel="noreferrer"
            >
              语法
            </a>
          </span>
          <ProFormTextArea
            name="caption"
            label="消息内容"
            placeholder="请输入具体消息"
            fieldProps={{ autoSize: true }}
            tooltip="Telegram Html 格式"
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default SendMessageToTelegram;
